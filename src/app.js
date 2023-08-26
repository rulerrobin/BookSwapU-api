import express from "express"
import { UserModel, BookModel, UserInventoryModel, MessageModel, dbClose } from "./db.js"
import cors from 'cors'
import chats from './data/data.js'
import userRoutes from './userRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

const app = express()

// Allows anyone to connect by default (good for development but not production)
// in production you add specific origins
app.use(cors())

app.use(express.json())

// Gets routes from userRoutes.js
app.use('/api/user', userRoutes)

// GET method default route handler.
app.get('/', (request, response) => response.send({ info: 'BookSwapU API!' }))

// CRUD request handlers for 'users' collection

// GET method request handler for retrieving all users data.
app.get('/users', async (req, res) => res.send(await UserModel.find()))

// GET method request handler for retrieving a single user based on their '_id' in the users collection.
app.get('/users/:user_id', async (req, res) => res.send(await UserModel.findById(req.params.user_id)))

// PUT method request handler for updating the current user's details (Profile).
// Note: When there is a password change, the property 'old_password' has to be 
// provided in the json request body and it has to match the password on record for the
// update to task place.
app.put('/users/:user_id', async (req,  res) => {
    try {
        // Get the current user
        const currentUser = await UserModel.findById(req.params.user_id)

        // Create a separate user object for update
        let userDetails = { username: req.body.username, email: req.body.email }

        // If password property exists in request body
        if (req.body.password) {
            // If password in request body is the same as password on record
            if (req.body.password === currentUser.password) {
                userDetails.password = req.body.password
            }
            else {  // If 'old_password' property is the same as password on record
                if (req.body.old_password === currentUser.password) {
                    userDetails.password = req.body.password
                }
                else {
                    res.status(404).send({ error: 'Old password is not on record'})
                    return
                }
            }
        }

        // Update the user with new details
        const updatedUser = await UserModel.findByIdAndUpdate(req.params.user_id, userDetails, { new: true })

        if (updatedUser) {
            res.status(201).send(updatedUser)
        }
        else {
            res.status(404).send({ error: 'User not found' })
        }
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// POST method request handler which allows
app.post('/users/register', async (req, res) => {
    try {
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

// CRUD request handlers for managing books.

// GET method request handler which returns the books associated with 
// a given user.
app.get('/users/:user_id/books', async (req, res) => {
    try {
        const inventoryEntries = await UserInventoryModel.find({ user: req.params.user_id })
            .populate('user')
            .populate('book')

        res.status(201).send(inventoryEntries)
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// POST method request handler for inserting a new book into a users collection.
// Note: 2 collections are inserted into here.
app.post('/users/:user_id/books', async (req, res) => {
    try {
        const insertedBook = await BookModel.create(req.body)
        const insertedInventoryItem = await UserInventoryModel.create({ user: req.params.user_id, book: insertedBook })

        res.status(201).send(insertedInventoryItem)
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// DELETE method request handler for deleting a book from a users collection.
// Note: 2 collections are deleted from here.
app.delete('/users/:user_id/books/:book_id',  async (req, res) => {
    try {
        const deletedInventoryItem = await UserInventoryModel.findOneAndDelete({ user: req.params.user_id, book: req.params.book_id })

        if (!deletedInventoryItem) {
            res.status(404).send({ error: 'User Inventory Entry not found' })
            return
        }

        const deletedBook = await BookModel.findByIdAndDelete(req.params.book_id)

        if (!deletedBook) {
            res.status(404).send({ error: 'Book not found' })
            return
        }

        res.sendStatus(200)
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// GET method request handler which returns the entire 'book' collection
app.get('/books', async (req, res) => res.send(await BookModel.find()))

// GET method request handler which returns individual books based on 'book_id' attribute
app.get('/books/:book_id', async (req,  res) => {
    try {
        const book = await BookModel.findById(req.params.book_id)

        if (book) {
            res.status(201).send(book)
        }
        else {
            res.status(404).send({ error: 'Book not found' })
        }
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// POST method request handler allows insertion of books into the 'books' collection.
// Note: The books are NOT associated with a user through 'UserInventoryModel'.
// This should never be called directly. Use 'POST /users/:user_id/books' instead.
app.post('/books', async (req, res) => {
    try {
        const insertedBook = await BookModel.create(req.body)
        res.status(201).send(insertedBook)
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// PUT method request handler which allows book details to be updated.
// Note: This can be called without WITHOUT a user_id parameter as the 
// association already exists in the 'UserInventoryModel', and we are
// just updating existing book details.
app.put('/books/:book_id', async (req,  res) => {
    try {
        const updatedBook = await BookModel.findByIdAndUpdate(req.params.book_id, req.body, { new: true })

        if (updatedBook) {
            res.status(201).send(updatedBook)
        }
        else {
            res.status(404).send({ error: 'Book not found' })
        }
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// GET method request handler which returns the entiree contents of 'UserInventoryModel'.
// These are the user-book mappings for every user and every book in the system.
app.get('/user_inventory', async (req, res) => res.send(await UserInventoryModel.find()))

// GET method request handler for retrieving user inventory entries based on title and/or author
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

// GET method for retrieving all the messages exhanged between all users.
app.get('/messages', async (req, res) => res.send(await MessageModel.find()))

// Testing Chat API
app.get('/api/chat', (req, res) => {
   res.send(chats)
})

app.get('/api/chat/:id', (req, res) => {
//  console.log(req.params.id)
   const singleChat = chats.find( c => c._id === req.params.id);
   res.send(singleChat)
})

// User error handlers
app.use(notFound)
app.use(errorHandler)

export default app
