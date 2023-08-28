import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import { UserModel } from "../models/userModel.js"

// POST method request handler which allows
const registerUser = asyncHandler(async (req, res) => {
    try {
        const insertedUser = await UserModel.create(req.body)
        res.status(201).send(insertedUser)
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// POST method request handler for submitting login info for user authentication
const login = asyncHandler(async (req, res) => {
    try {
        let user = {}
        if ('username' in req.body) {
            user = await UserModel.findOne({ username: req.body.username })
        }
        else if ('email' in req.body) {
            user = await UserModel.findOne({ email: req.body.email })
        }
        else {
            res.status(400).send({ error: 'Username and/or email not found' })
            return
        }

        if (!user)
        {
            res.status(403).send({ error: 'Incorrect login details' })
            return
        }

        if ('password' in req.body) {
            if (await user.matchPassword(req.body.password)) {

                const userDetails = {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    pic: user.pic,
                    token: generateToken(user._id)
                }

                res.status(201).send(userDetails)

            //     res.json({
            //         _id: user._id,
            //         username: user.username,
            //         email: user.email,
            //         pic: user.pic,
            //         token: generateToken(user._id)
            //   })
            }
            else {
                res.status(403).send({ error: 'Incorrect login details' })
                return
            }
        }
        else {
            res.status(400).send({ error: 'Password not supplied' })
            return
        }
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

export { registerUser, login }
