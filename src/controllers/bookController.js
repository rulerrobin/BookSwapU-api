import asyncHandler from 'express-async-handler'
import { BookModel } from "../models/bookModel.js"
import { UserInventoryModel } from "../models/userInventoryModel.js"

// GET method request controller which returns the books owned by  
// the logged in user.
const oneUsersBooks = asyncHandler(async (req, res) => {
    try {
        const inventoryEntries = await UserInventoryModel.find({ user: req.user._id })
            .populate('user')
            .populate('book')

        res.status(201).send(inventoryEntries)
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// GET method request controller which returns individual books based on 'book_id' parameter.
// Only returns the single book if it belongs to the logged in user.
const getOneBook = asyncHandler(async (req,  res) => {
    try {
        // Retrieves the book through UserInventoryModel instead of BookModel. Only books 
        // that belong to the logged in user are retrieved.
        const entry = await UserInventoryModel.findOne({ user: req.user._id, book: req.params.book_id })
            .populate('book')

        if (entry) {
            res.status(201).send(entry.book)
        }
        else {
            res.status(404).send({ error: 'Book not found' })
        }
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// POST method request controller for inserting a new book into the 
// logged in users collection. Note: 2 collections are inserted into 
// here (userinventory & books).
const addBookToUsersCollection = asyncHandler(async (req, res) => {
    try {
        const insertedBook = await BookModel.create(req.body)
        const insertedInventoryItem = await UserInventoryModel.create({ user: req.user._id, book: insertedBook })

        res.status(201).send(insertedInventoryItem)
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// PUT method request controller which allows book details to be updated 
// but only if the book belongs to the logged in user.
const updateBookDetails = asyncHandler(async (req,  res) => {
    try {
        // This check ensures only books that belong to the logged 
        // in user are updated.
        const entry = UserInventoryModel.findOne({ user: req.user._id, book: req.params.book_id })

        if (!entry) {
            return res.status(404).send({ error: 'Book not found' })
        }

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

// DELETE method request handler for deleting a book from a users collection.
// Note: 2 collections are deleted from here.
const deleteBookFromUsersCollection = asyncHandler(async (req, res) => {
    try {
        // Delete user_id-book_id mapping from 'userinventory' collection  for the logged in user
        const deletedInventoryItem = await UserInventoryModel.findOneAndDelete({ user: req.user._id, book: req.params.book_id })

        if (!deletedInventoryItem) {
            res.status(404).send({ error: 'User Inventory Entry not found' })
            return
        }

        // Delete book from 'Books' collection
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
// const getAllBooks = asyncHandler(async (req, res) => res.send(await BookModel.find()))

// POST method request handler allows insertion of books into the 'books' collection.
// Note: The books are NOT associated with a user through 'UserInventoryModel'.
// This should never be called directly. Use 'POST /users/:user_id/books' instead.
// const addNewBook = asyncHandler(async (req, res) => {
//     try {
//         const insertedBook = await BookModel.create(req.body)
//         res.status(201).send(insertedBook)
//     }
//     catch (err) {
//         res.status(500).send({ error: err.message })
//     }
// })


export { oneUsersBooks, addBookToUsersCollection,  deleteBookFromUsersCollection, getOneBook, updateBookDetails }
