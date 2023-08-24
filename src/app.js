import express from "express"
// import { UserModel, BookModel, UserInventoryModel, MessageModel, dbClose } from "./db.js"
import cors from 'cors'
import chats from './data/data.js'

const app = express()

// Allows anyone to connect by default (good for development but not production)
// in production you add specific origins
app.use(cors())

app.use(express.json())

app.get('/', (request, response) => response.send({ info: 'BookSwapU API!' }))

app.get('/users', async (req, res) => res.send(await UserModel.find()))

app.get('/books', async (req, res) => res.send(await BookModel.find()))

app.get('/user_inventory', async (req, res) => res.send(await UserInventoryModel.find()))

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

export default app
