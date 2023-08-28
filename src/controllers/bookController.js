import asyncHandler from 'express-async-handler'
import { BookModel } from "../models/bookModel.js"
import { UserInventoryModel } from "../models/userInventoryModel.js"

// GET method request handler which returns the books associated with 
// a given user.
const oneUsersBooks = asyncHandler(async (req, res) => {
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
const addBookToUsersCollection = asyncHandler(async (req, res) => {
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
const deleteBookFromUsersCollection = asyncHandler(async (req, res) => {
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
const getAllBooks = asyncHandler(async (req, res) => res.send(await BookModel.find()))

// GET method request handler which returns individual books based on 'book_id' attribute
const getOneBook = asyncHandler(async (req,  res) => {
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
const addNewBook = asyncHandler(async (req, res) => {
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
const updateBookDetails = asyncHandler(async (req,  res) => {
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

export { oneUsersBooks, addBookToUsersCollection,  deleteBookFromUsersCollection, getAllBooks, getOneBook, addNewBook, updateBookDetails }
