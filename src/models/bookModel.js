import mongoose from 'mongoose'

// Define a schema for the Book model
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    condition: { type: String, required: true },
    status: { type: String, required: true },
    edition: { type: String, required: true },
    year: { type: String, required: true }
  })
  
// Create a Book model from the defined schema
const BookModel = mongoose.model('Book', bookSchema)

export { BookModel}
