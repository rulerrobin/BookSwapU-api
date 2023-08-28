import express from "express"
import { MessageModel } from "./db.js"
import cors from 'cors'
import chats from './data/data.js'
import userRoutes from './userRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

import verifyToken from "./verifyToken.js"
import authRouter from './routes/authRouter.js'
import userRouter from './routes/userRouter.js'
import bookRouter from './routes/bookRouter.js'
import inventoryRouter from './routes/inventoryRouter.js'

const app = express()

// Allows anyone to connect by default (good for development but not production)
// in production you add specific origins
app.use(cors())

app.use(express.json())

// Gets routes from userRoutes.js
app.use('/api/user', userRoutes)

// GET method default route handler.
app.get('/', (request, response) => response.send({ info: 'BookSwapU API!' }))

// Contains the routes for authorization & jwt authentication
app.use('/', authRouter)

// Verifies JSON Web token before performing any CRUD operations
app.use(verifyToken)

// Load the main CRUD routes for the application
app.use('/', userRouter)
app.use('/', bookRouter)
app.use('/', inventoryRouter)

// GET method for retrieving all the messages exhanged between all users.
app.get('/messages', async (req, res) => res.send(await MessageModel.find()))

// Testing Chat API
app.get('/api/chat', (req, res) => {
   res.send(chats)
})

app.get('/api/chat/:id', (req, res) => {
//  console.log(req.params.id)
   const singleChat = chats.find( c => c._id === req.params.id);
   res.send(singleChat)
})

// User error handlers
app.use(notFound)
app.use(errorHandler)

export default app
