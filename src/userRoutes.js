import express from "express"
import registerUser  from './userControllers.js'

const router = express.Router()

router.route('/').post(registerUser)

// router.route('/login', authUser)

export default router