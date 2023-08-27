import asyncHandler from 'express-async-handler'
import generateToken from '../generateToken.js'
import { BookModel, UserInventoryModel } from "../db.js"

// GET method request handler which returns the entire contents of 'UserInventoryModel'.
// These are the user-book mappings for every user and every book in the system.
const getInventoryAll = asyncHandler(async (req, res) => res.send(await UserInventoryModel.find()))

// GET method request handler for retrieving user inventory entries based on title and/or author.
// Uses regex's to search for partial titles and/or authors.
const searchInventory = asyncHandler(async (req, res) => {
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

export { getInventoryAll, searchInventory }

