import express from 'express'
import verifyToken from '../middleware/verifyToken.js'
import { sendMessage, allMessages } from '../controllers/messageControllers.js'

const router = express.Router()

// Send Message
router.route('/').post(verifyToken, sendMessage)

// Fetch message in a chat
router.route('/:chatId').get(verifyToken, allMessages)

export default router