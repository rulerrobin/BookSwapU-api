// Import required modules
import mongoose from 'mongoose'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

// Function to close the database connection
async function dbClose() {
  await mongoose.connection.close()
  console.log('Database disconnected')
}

// Connect to the MongoDB database using the provided Atlas URL
mongoose.connect(process.env.ATLAS_DB_URL)
  .then(m => console.log(m.connection.readyState === 1 ? 'Mongoose connected!' : 'Mongoose failed to connect'))
  .catch(err => console.error(err))

// Define a schema for the User model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

// Create a User model from the defined schema
const UserModel = mongoose.model('User', userSchema)

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

// Define a schema for the UserInventory model
const userInventorySchema = new mongoose.Schema({
  user: { type: mongoose.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.ObjectId, ref: 'Book', required: true }
})

// Create a UserInventory model from the defined schema
const UserInventoryModel = mongoose.model('UserInventory', userInventorySchema)

// Define a schema for the Message model
const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
})

// Create a Message model from the defined schema
const MessageModel = mongoose.model('Message', messageSchema)

// Export models and the dbClose function for use in other modules
export { UserModel, BookModel, UserInventoryModel, MessageModel, dbClose }
