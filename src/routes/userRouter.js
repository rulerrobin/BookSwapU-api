import { Router } from 'express'
import { getOneUser, updateUserDetails } from "../controllers/userController.js"

const router = Router()

// CRUD request handlers for 'users' collection

// GET method request handler for retrieving all users data.
// router.get('/users', getAllUsers)

// GET method request handler for retrieving a single user based on their '_id' in the users collection.
// router.get('/users/:user_id', getOneUser)
router.get('/user', getOneUser)

// PUT method request handler for updating the current user's details (Profile).
// Note: When there is a password change, the property 'old_password' has to be 
// provided in the json request body and it has to match the password on record for the
// update to task place.
// router.put('/users/:user_id', updateUserDetails)
router.put('/user', updateUserDetails)

// Export the router instance to be used in other parts of the application
export default router
