import { Router } from 'express'
import verifyToken from '../middleware/verifyToken.js'
import { getOneUser, updateUserDetails, getChatUsers } from "../controllers/userControllers.js"

const router = Router()

// CRUD request handlers for 'users' collection

// GET method request handler for retrieving a single user based on their '_id' in the users collection.
router.get('/user', getOneUser)

// PUT method request handler for updating the current user's details (Profile).
// Note: When there is a password change, the property 'old_password' has to be 
// provided in the json request body and it has to match the password on record for the
// update to task place.
router.put('/user', updateUserDetails)

// Handle POST requests to the root path ('/') 
router.route('/').get(verifyToken, getChatUsers)

// Export the router instance to be used in other parts of the application
export default router
