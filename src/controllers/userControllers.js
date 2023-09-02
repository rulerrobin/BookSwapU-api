import asyncHandler from 'express-async-handler'
import { UserModel } from "../models/userModel.js"

// GET method request controller for retrieving the current logged in users details.
const getOneUser = asyncHandler(async (req,  res) => {
    // Use the '_id' in the request which is drawn from the web token 
    // of the current logged in user.
    const user = await UserModel.findById(req.user._id)

    if (user) {
        res.status(201).send(user)
    }
    else {
        throw Error('User not found')
    }
})

// PUT method request controller for updating the current user's details (Profile).
// Note: When there is a password change, the property 'old_password' has to be 
// provided in the json request body and it has to match the password on record for the
// update to task place.
const updateUserDetails = asyncHandler(async (req,  res) => {
    // Get the current logged in user
    const currentUser = await UserModel.findById(req.user._id)
    if (!currentUser) {
        throw new Error('User not found')
    }

    // Destructure elements to update
    const { username, email, old_password, password } = req.body

    // Update username if supplied in json request
    if (username) {
        currentUser.username = username
    }

    // Update email if supplied in json request
    if (email) {
        currentUser.email = email
    }

    // If password in request body is the same as password on record
    if (password && !(await currentUser.matchPassword(password))) {
        // If 'old_password' property is the same as password on record
        if (old_password && (await currentUser.matchPassword(old_password)))
        {
            currentUser.password = password
        }
        else {
            res.status(404)
                throw new Error('Old password is missing or not on record')
        }
    }

    // save() has to be called explicity to trigger the pre save hook and
    // store the password in encrypted form.
    await currentUser.save()

    if (currentUser) {
        res.status(201).send(currentUser)
    }
    else {
        res.status(404)
        throw new Error('User not found')
    }
})

// Search user's for chat /api/user?search=name
const getChatUsers = asyncHandler(async (req, res) => {
   const keyword = req.query.search
   ? {
       $and: [
           {
                 $or: [
                     { username: { $regex: req.query.search, $options: "i" } },
                     { email: { $regex: req.query.search, $options: "i" } },
                 ],
           },
           {
             _id: { $ne: req.user._id }
           }
         ]
   }
   : { _id: { $ne: req.user._id } }
   // Return users without the user that is not equal to logged in
   const users = await UserModel.find(keyword)
   res.send(users)
   // console.log(req.user._id)
})

export { updateUserDetails, getOneUser, getChatUsers }