import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

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
  
  export { UserModel }
