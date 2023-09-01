// Import the 'app' module from the 'app.js' file
import app from './app.js'
// Import the 'dotenv' module to load environment variables from a '.env' file
import dotenv from 'dotenv'

import { Server } from "socket.io"
// Load environment variables from the '.env' file
dotenv.config()
// Define the port number on which the server will listen with 5000 as backup
const PORT = process.env.PORT || 5000
// Start the server and listen on the specified port
const server = app.listen(PORT, console.log(`Server Started on ${PORT}`)) // Output a message to the console indicating that the server has started
// Socket.io
const io = new Server(server, {
   pingTimeout: 60000,
   cors: {
      origin: "http://localhost:3001", // the local host of frontend when you do npm run dev
   }
})

io.on("connection", (socket) => {
   console.log('Connected to socket.io')

   socket.on("setup", (userData) => {
      socket.join(userData._id)
      // console.log(userData._id)
      socket.emit("connected")
   })

   socket.on("join chat", (room) => {
      socket.join(room)
      console.log("User Joined Room: " + room)
   })

   socket.on("typing", (room) => socket.in(room).emit("typing"))
   socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))

   socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat

      if (!chat.users) return console.log("chat.users not defined")

      chat.users.forEach((user) => {
         if (user._id == newMessageRecieved.sender._id) return

         socket.in(user._id).emit("message recieved", newMessageRecieved)
      })
   })
})