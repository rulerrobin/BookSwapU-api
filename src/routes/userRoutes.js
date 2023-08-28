// Import Router from express
import { Router } from 'express'
// Import the 'registerUser' and 'authUser' functions from 'userControllers.js'
import { registerUser, authUser }  from '../controllers/userControllers.js'

// Create an instance of an Express Router
const router = Router()

// Define routes and their corresponding HTTP methods
// 'router.route()' creates a chainable route handler for the specified path

// Handle POST requests to the root path ('/') by calling the 'registerUser' function
router.post('/', registerUser)

// Handle POST requests to the '/login' path by calling the 'authUser' function
router.post('/login', authUser)

// Export the router instance to be used in other parts of the application
export default router 