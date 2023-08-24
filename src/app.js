import express from "express"
import { UserModel, BookModel, UserInventoryModel, MessageModel, dbClose } from "./db.js"
import cors from 'cors'

const app = express()

// Allows anyone to connect by default (good for development but not production)
// in production you add specific origins
app.use(cors())

app.use(express.json())

app.get('/', (request, response) => response.send({ info: 'BookSwapU API!' }))

app.get('/users', async (req, res) => res.send(await UserModel.find()))

// POST method request handler which allows
app.post('/users/register', async (req, res) => {
    try {
        console.log(req.body)
        const insertedUser = await UserModel.create(req.body)
        res.status(201).send(insertedUser)
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// POST method request handler for submitting login info for user authentication
app.post('/users/login', async (req, res) => {
    try {
        let user = {}
        if ('username' in req.body) {
            user = await UserModel.findOne({ username: req.body.username })
        }
        else if ('email' in req.body) {
            user = await UserModel.findOne({ email: req.body.email })
        }
        else {
            res.status(400).send({ error: 'Username and/or email not found' })
            return
        }

        if (!user)
        {
            res.status(403).send({ error: 'Incorrect login details' })
            return
        }

        if ('password' in req.body) {
            if (req.body.password === user.password)
                res.status(201).send(user)
            else {
                res.status(403).send({ error: 'Incorrect login details' })
                return
            }
        }
        else {
            res.status(400).send({ error: 'Password not supplied' })
            return
        }
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})


app.get('/books', async (req, res) => res.send(await BookModel.find()))

app.get('/user_inventory', async (req, res) => res.send(await UserInventoryModel.find()))

// GET method request handler for retrieving user inventory entries based on title or author
app.get('/user_inventory/search', async (req, res) => {
    try {
        // const matchingBooks = await BookModel.find({ title: { $regex: req.body.title, $options: "i" }})

        const searchBy = []
        if (req.body.title) {
            searchBy.push({ title: { $regex: req.body.title, $options: "i" } })
        }

        if (req.body.author) {
            searchBy.push({ author: { $regex: req.body.author, $options: "i" } })
        }

        // Search for books based on title and author using a regular expression
        const matchingBooks = await BookModel.find({ 
            $and: searchBy
        })

        // Retrieve user/book pairs from user_inventory collection using matching book ids
        const userBookPairs = await UserInventoryModel.find({ book: { $in: matchingBooks.map(book => book._id) } })
            .populate('user')
            .populate('book')

        console.log(userBookPairs)

        if (userBookPairs) {
            res.send(userBookPairs)
        } else {
            res.status(404).send({ error: 'Book not found' })
        }
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

app.get('/messages', async (req, res) => res.send(await MessageModel.find()))

export default app
