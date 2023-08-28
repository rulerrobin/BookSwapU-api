import mongoose from 'mongoose'

// Define a schema for the UserInventory model
const userInventorySchema = new mongoose.Schema({
    user: { type: mongoose.ObjectId, ref: 'User', required: true },
    book: { type: mongoose.ObjectId, ref: 'Book', required: true }
  })
  
// Create a UserInventory model from the defined schema
const UserInventoryModel = mongoose.model('UserInventory', userInventorySchema)

export {  UserInventoryModel }
