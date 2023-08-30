import asyncHandler from 'express-async-handler'
import { BookModel } from "../models/bookModel.js"
import { UserInventoryModel } from "../models/userInventoryModel.js"

// GET method request controller which returns the books owned by  
// the logged in user.
const oneUsersBooks = asyncHandler(async (req, res) => {
    const inventoryEntries = await UserInventoryModel.find({ user: req.user._id })
        .populate('book')

    if (!inventoryEntries) {
        res.status(400)
        throw new Error('User has no books in their inventory.')
    }

    // Extract the books out of inventoryEntries.
    const books = inventoryEntries.map(function (entry) {
        return entry.book
    })

    res.status(201).send(books)
})

// GET method request controller which returns individual books based on 'book_id' parameter.
// Only returns the single book if it belongs to the logged in user.
const getOneBook = asyncHandler(async (req,  res) => {
    // Retrieves the book through UserInventoryModel instead of BookModel. Only books 
    // that belong to the logged in user are retrieved.
    const entry = await UserInventoryModel.findOne({ user: req.user._id, book: req.params.book_id })
        .populate('book')

    if (entry) {
        res.status(201).send(entry.book)
    }
    else {
        res.status(404)
        throw new Error('Book not found')
    }
})

// POST method request controller for inserting a new book into the 
// logged in users collection. Note: 2 collections are inserted into 
// here (userinventory & books).
const addBookToUsersCollection = asyncHandler(async (req, res) => {
    const insertedBook = await BookModel.create(req.body)
    if (!insertedBook) {
        res.status(404)
        throw new Error('Could not create new book in users collection')
    }

    const insertedInventoryItem = await UserInventoryModel.create({ user: req.user._id, book: insertedBook })
    if (!insertedInventoryItem) {
        res.status(404)
        throw new Error('Could not create a new book')
    }

    res.status(201).send(insertedBook)
})

// PUT method request controller which allows book details to be updated 
// but only if the book belongs to the logged in user.
const updateBookDetails = asyncHandler(async (req,  res) => {
    // This check ensures only books that belong to the logged 
    // in user are updated.
    const entry = UserInventoryModel.findOne({ user: req.user._id, book: req.params.book_id })

    if (!entry) {
        res.status(404)
        throw new Error('User does not have this book in their collection')
    }

    const updatedBook = await BookModel.findByIdAndUpdate(req.params.book_id, req.body, { new: true })

    if (updatedBook) {
        res.status(201).send(updatedBook)
    }
    else {
        res.status(404)
        throw new Error('Could not retrieve book to update')
    }
})

// DELETE method request handler for deleting a book from a users collection.
// Note: 2 collections are deleted from here.
const deleteBookFromUsersCollection = asyncHandler(async (req, res) => {
    // Delete user_id-book_id mapping from 'userinventory' collection  for the logged in user
    const deletedInventoryItem = await UserInventoryModel.findOneAndDelete({ user: req.user._id, book: req.params.book_id })

    if (!deletedInventoryItem) {
        res.status(404)
        throw new Error('User does not have this book in their collection')
    }

    // Delete book from 'Books' collection
    const deletedBook = await BookModel.findByIdAndDelete(req.params.book_id)

    if (!deletedBook) {
        res.status(404)
        throw new Error('Could not retrieve book to delete')
    }

    res.sendStatus(200)
})

export { oneUsersBooks, addBookToUsersCollection,  deleteBookFromUsersCollection, getOneBook, updateBookDetails }
