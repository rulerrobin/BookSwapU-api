import express from 'express'
import verifyToken from '../middleware/verifyToken.js'
import { accessChat, fetchChats } from '../controllers/chatControllers.js'

const router = express.Router()

// Chat Creation
router.route('/').post(verifyToken, accessChat)

// Fetchchat gets all chat from particular user
router.route('/').get(verifyToken, fetchChats)

// Group Chat
// router.route('/group').post(verifyToken, createGroupChat)
// router.route('/rename').put(verifyToken, renameGroup)
// router.route('/groupremove').put(verifyToken, removeFromGroup)
// router.route('/groupadd').put(protect, addToGroup)

export default router