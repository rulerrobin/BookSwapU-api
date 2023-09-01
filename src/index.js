// Import the 'app' module from the 'app.js' file
import app from './app.js'
// Import the 'dotenv' module to load environment variables from a '.env' file
import dotenv from 'dotenv'
// Import server from socket.io
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
      origin: "http://localhost:3001", // Define the allowed origin for CORS, typically the frontend's address
   }
})

io.on("connection", (socket) => {
   // When a client connects, this function is called
   console.log('Connected to socket.io') // Log a message to indicate a successful connection

   socket.on("setup", (userData) => {
      // When a "setup" event is received from the client, this function is called
      socket.join(userData._id) // The client joins a room with the user's ID
      // console.log(userData._id)
      socket.emit("connected") // Emit a "connected" event back to the client
   })

   socket.on("join chat", (room) => {
      // When a "join chat" event is received from the client, this function is called
      socket.join(room) // The client joins a specific chat room
      console.log("User Joined Room: " + room) // Log a message indicating the user joined the room
   })

   // When a "typing" event is received from the client, emit a "typing" event to all clients in the same chat room
   socket.on("typing", (room) => socket.in(room).emit("typing"))

    // When a "stop typing" event is received from the client, emit a "stop typing" event to all clients in the same chat room
   socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))

   // When a "new message" event is received from the client, this function is called
   socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat

      if (!chat.users) return console.log("chat.users not defined")

      chat.users.forEach((user) => {
         // Iterate through the users in the chat
         if (user._id == newMessageRecieved.sender._id) return

         // Emit a "message received" event to all clients except the sender in the chat
         socket.in(user._id).emit("message recieved", newMessageRecieved)
      })
   })
})