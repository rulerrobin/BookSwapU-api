// Import required modules
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'

// Load environment variables from .env file
dotenv.config()

// Function to close the database connection
async function dbClose() {
  await mongoose.connection.close()
  console.log('Database disconnected')
}

// console.log(process.env.ATLAS_DB_URL) // debug test to see what process.env.ATLAS_DB_URL finds
// Connect to the MongoDB database using the provided Atlas URL
mongoose.connect(process.env.ATLAS_DB_URL)
  .then(m => console.log(m.connection.readyState === 1 ? 'Mongoose connected!' : 'Mongoose failed to connect'))
  .catch(err => console.error(err))

// Define a schema for the User model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  },
  { 
    timesamps: true 
  }
)

userSchema.methods.matchPassword=async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Before saving complete function (encrypt password)
userSchema.pre('save', async function (next) {
  if(!this.isModified) {
    next()
  }
  // encryption processing rounds 2^10
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
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

// Define a schema for the Chat model
const chatSchema = new mongoose.Schema({
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  latestMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message"
  },
  chatname: { type: String, trim: true },
  // sender: { type: mongoose.ObjectId, ref: 'User', required: true },
  // receiver: { type: mongoose.ObjectId, ref: 'User', required: true },
  // content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

// Create a Chat model from the defined schema
const ChatModel = mongoose.model('Chat', chatSchema)

// Define a schema for the Messages model
const messageModel = new mongoose.Schema({
  // id of sender
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // content of message
  content: { type: String, trim: true},
  // reference of chat message belongs to
  chat: {type: mongoose.Schema.Types.ObjectId, ref: 'Chat'},
  },
  {
    timestamps: true,
  }
)

const MessageModel = mongoose.model('Message', messageModel)

// Export models and the dbClose function for use in other modules
export { UserModel, BookModel, UserInventoryModel, ChatModel, MessageModel, dbClose }
