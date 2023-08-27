// Import the 'express' module for creating a router
import express from "express"
// Import the 'registerUser' and 'authUser' functions from 'userControllers.js'
import { registerUser, authUser }  from './controllers/userControllers.js'
// Create an instance of an Express Router
const router = express.Router()
// Define routes and their corresponding HTTP methods
// 'router.route()' creates a chainable route handler for the specified path

// Handle POST requests to the root path ('/') by calling the 'registerUser' function
router.route('/').post(registerUser)
// Handle POST requests to the '/login' path by calling the 'authUser' function
router.route('/login').post(authUser)

// Export the router instance to be used in other parts of the application
export default router 