import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

// Define a schema for the User model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
    },
    { 
        timesamps: true 
    }
)

userSchema.methods.matchPassword=async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// Excludes password from every response
userSchema.methods.toJSON = function() {
    var obj = this.toObject()
    delete obj.password
    return obj
}

// Before saving complete function (encrypt password)
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) { // Check if the password field is modified
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
    }

    next()
})

// Create a User model from the defined schema
const UserModel = mongoose.model('User', userSchema)

export { UserModel }
