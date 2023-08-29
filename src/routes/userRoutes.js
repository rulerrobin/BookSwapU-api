// Import express from express
import express from 'express'
// Import the 'registerUser' and 'authUser' functions from 'userControllers.js'
import { registerUser, authUser, getChatUsers }  from '../controllers/userControllers.js'
import verifyToken from '../middleware/verifyToken.js'


// Create an instance of an Express Router
const router = express.Router()

// Define routes and their corresponding HTTP methods
// 'router.route()' creates a chainable route handler for the specified path

// Handle POST requests to the root path ('/') 
router.route('/')
   .post(registerUser)
   .get(verifyToken, getChatUsers)

// Handle POST requests to the '/login' path by calling the 'authUser' function
router.route('/login')
   .post(authUser)

// Export the router instance to be used in other parts of the application
export default router 