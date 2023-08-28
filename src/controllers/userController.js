import asyncHandler from 'express-async-handler'
import { UserModel } from "../db.js"

// GET method request handler for retrieving all users data.
const getAllUsers = asyncHandler(async (req, res) => res.send(await UserModel.find()))

// GET method request handler for retrieving a single user based on their '_id' in the users collection.
const getOneUser = asyncHandler(async (req,  res) => {
    try {
        const user = await UserModel.findById(req.params.user_id)

        if (user) {
            res.status(201).send(user)
        }
        else {
            res.status(404).send({ error: 'User not found' })
        }
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// PUT method request handler for updating the current user's details (Profile).
// Note: When there is a password change, the property 'old_password' has to be 
// provided in the json request body and it has to match the password on record for the
// update to task place.
const updateUserDetails = asyncHandler(async (req,  res) => {
    try {
        // Get the current user
        const currentUser = await UserModel.findById(req.params.user_id)

        // Create a separate user object for update
        let userDetails = { username: req.body.username, email: req.body.email }

        // If password property exists in request body
        if (req.body.password) {
            // If password in request body is the same as password on record
            if (req.body.password === currentUser.password) {
                userDetails.password = req.body.password
            }
            else {  // If 'old_password' property is the same as password on record
                if (req.body.old_password === currentUser.password) {
                    userDetails.password = req.body.password
                }
                else {
                    res.status(404).send({ error: 'Old password is not on record'})
                    return
                }
            }
        }

        // Update the user with new details
        const updatedUser = await UserModel.findByIdAndUpdate(req.params.user_id, userDetails, { new: true })

        if (updatedUser) {
            res.status(201).send(updatedUser)
        }
        else {
            res.status(404).send({ error: 'User not found' })
        }
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

export { getAllUsers, getOneUser, updateUserDetails }
