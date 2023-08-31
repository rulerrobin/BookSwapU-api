import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import { UserModel } from "../models/userModel.js"

// POST method request handler which allows
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body

    // Check if required fields are provided
    if (!username || !email || !password) {
        res.status(400)
        throw new Error("Please enter all required fields")
    }

    // Check if user with the same email already exists
    const userExists = await UserModel.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error("User already exists")
    }

    // Create a new user
    const user = await UserModel.create({
        username,
        email,
        password
    })

    // Return user information and token upon successful registration
    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        })
    } else {
        res.status(404)
        throw new Error ("Failed to create User")
    }
})

// POST method request handler for submitting login info for user authentication
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    // Find the user by email
    const user = await UserModel.findOne({ email })

    // Check if user exists and the provided password matches
    if ( user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        })
    } else {
        res.status(401)
        throw new Error("Invalid Email or Password")
    }
})

export { registerUser, authUser }
