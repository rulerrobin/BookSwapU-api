import asyncHandler from 'express-async-handler'
import generateToken from './generateToken.js'
import { UserModel } from './db.js'

const registerUser = asyncHandler(async (req, res) => {
   const { username, email, password, pic } = req.body

   if (!username || !email || !password) {
      res.status(400)
      throw new Error("Please enter a all required fields")
   }

   const userExists = await UserModel.findOne({ email })

   if (userExists) {
      res.status(400)
      throw new Error("User already exists")
   }

   const user = await UserModel.create({
      username,
      email,
      password,
      pic,
   })

   if (user) {
      res.status(201).json({
         _id: user._id,
         username: user.username,
         email: user.email,
         pic: user.pic,
         token: generateToken(user._id),
      })
   } else {
      res.status(404)
      throw new Error ("Failed to create User")
   }
})

const authUser = asyncHandler(async (req, res) => {
   const { email, password } = req.body

   const user = await UserModel.findOne({ email })

   if ( user && (await user.matchPassword(password))) {
      res.json({
         _id: user._id,
         username: user.username,
         email: user.email,
         pic: user.pic,
         token: generateToken(user._id),
   })
   } else {
   res.status(401)
   throw new Error("Invalid Email or Password")
}
})

export { registerUser, authUser }