import { Router } from 'express'
import { oneUsersBooks, addBookToUsersCollection,  deleteBookFromUsersCollection, getAllBooks, getOneBook, addNewBook, updateBookDetails }  from '../controllers/bookController.js'

const router = Router()

// CRUD request handlers for managing books.

// GET method request handler which returns the books associated with 
// a given user.
router.get('/users/:user_id/books', oneUsersBooks)

// POST method request handler for inserting a new book into a users collection.
// Note: 2 collections are inserted into here.
router.post('/users/:user_id/books', addBookToUsersCollection)

// DELETE method request handler for deleting a book from a users collection.
// Note: 2 mongodb collections are deleted from here.
router.delete('/users/:user_id/books/:book_id',  deleteBookFromUsersCollection)

// GET method request handler which returns the entire 'book' collection
router.get('/books', getAllBooks)

// GET method request handler which returns individual books based on 'book_id' attribute
router.get('/books/:book_id', getOneBook)

// POST method request handler allows insertion of books into the 'books' collection.
// Note: The books are NOT associated with a user through 'UserInventoryModel'.
// This should never be called directly. Use 'POST /users/:user_id/books' instead.
router.post('/books', addNewBook)

// PUT method request handler which allows book details to be updated.
// Note: This can be called without WITHOUT a user_id parameter as the 
// association already exists in the 'UserInventoryModel', and we are
// just updating existing book details.
router.put('/books/:book_id', updateBookDetails)

// Export the router instance to be used in other parts of the application
export default router
