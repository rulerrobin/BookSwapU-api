import mongoose from 'mongoose'
// import { Schema } from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

async function dbClose() {
  await mongoose.connection.close()
  console.log('Database disconnected')
}

mongoose.connect(process.env.ATLAS_DB_URL)
  .then(m => console.log(m.connection.readyState === 1 ? 'Mongoose connected!' : 'Mongoose failed to connect'))
  .catch(err => console.error(err))

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true }
})

const UserModel = mongoose.model('User', userSchema)

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  condition: { type: String, required: true },
  status: { type: String, required: true },
  edition: { type: String, required: true },
  year: { type: String, required: true }
})

const BookModel = mongoose.model('Book', bookSchema)

const userInventorySchema = new mongoose.Schema({
  user: { type: mongoose.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.ObjectId, ref: 'Book', required: true }
})

const UserInventoryModel = mongoose.model('UserInventory', userInventorySchema)

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
})

const MessageModel = mongoose.model('Message', messageSchema)

export { UserModel, BookModel, UserInventoryModel, MessageModel, dbClose }
