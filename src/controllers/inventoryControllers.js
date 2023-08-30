import asyncHandler from 'express-async-handler'
import { BookModel } from "../models/bookModel.js"
import { UserInventoryModel } from "../models/userInventoryModel.js"

// GET method request controller for retrieving user inventory entries based on title and/or author.
// Uses regex's to search for partial titles and/or authors.
const searchInventory = asyncHandler(async (req, res) => {
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
        res.status(404)
        throw new Error('Book not found')
    }
})

export { searchInventory }

