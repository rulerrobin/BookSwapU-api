import { Router } from 'express'
import { registerUser, login } from "../controllers/authController.js"

const router = Router()

// POST method request handler which allows
router.post('/users/register', registerUser)

// POST method request handler for submitting login info for user authentication
router.post('/users/login', login)

// Export the router instance to be used in other parts of the application
export default router
