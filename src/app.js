import express from "express"
import { db } from "./database/db.js"
import cors from 'cors'
import chats from './data/data.js'
import userRoutes from './routes/userRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

import verifyToken from "./middleware/verifyToken.js"
import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js'
import bookRouter from './routes/bookRoutes.js'
import inventoryRouter from './routes/inventoryRoutes.js'

const baseURI = '/'

const app = express()

// Allows anyone to connect by default (good for development but not production)
// in production you add specific origins
app.use(cors())

app.use(express.json())

// Gets routes from userRoutes.js
app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

// GET method default route handler.
app.get('/', (request, response) => response.send({ info: 'BookSwapU API!' }))

// Contains the routes for authorization & jwt authentication
app.use(baseURI, authRouter)

// Verifies JSON Web token before performing any CRUD operations
app.use(verifyToken)

// Load the main CRUD routes for the application
app.use(baseURI, userRouter)
app.use(baseURI, bookRouter)
app.use(baseURI, inventoryRouter)

app.get('/api/chat/:id', (req, res) => {
//  console.log(req.params.id)
   const singleChat = chats.find( c => c._id === req.params.id);
   res.send(singleChat)
})

// Error handling middleware - All exceptions are 
// directed to these.
app.use(notFound)
app.use(errorHandler)

export default app
