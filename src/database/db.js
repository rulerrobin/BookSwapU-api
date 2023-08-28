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

// console.log(process.env.ATLAS_DB_URL) // debug test to see what process.env.ATLAS_DB_URL finds
// Connect to the MongoDB database using the provided Atlas URL
mongoose.connect(process.env.ATLAS_DB_URL)
  .then(m => console.log(m.connection.readyState === 1 ? 'Mongoose connected!' : 'Mongoose failed to connect'))
  .catch(err => console.error(err))

const db = mongoose.connection

// Export db connection & dbClose function for use in other modules
export { db, dbClose }
