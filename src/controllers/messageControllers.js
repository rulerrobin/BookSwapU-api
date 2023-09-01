import asyncHandler from 'express-async-handler'
import express from 'express'
import { ChatModel, MessageModel } from "../models/chatModel.js"
import { UserModel } from "../models/userModel.js"

// Handler for sending a new message
const sendMessage= asyncHandler(async (req, res) => {
   const {content, chatId} = req.body

   // Check if required data is missing from the request
   if (!content || !chatId ) {
      console.log("Invalid data passed into request")
      return res.sendStatus(400) // Respond with a 400 Bad Request status
   }

   // Create a new message object
   var newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId
   }

   try {
      // Create the message in the database
      var message = await MessageModel.create(newMessage)

      // Populate sender information
      message = await message.populate("sender", "username")
      // Populate chat information
      message = await message.populate("chat",)
      // Populate user information in the chat
      message = await UserModel.populate(message, {
         path: 'chat.users',
         select: 'username email'
      })
         // Update the latestMessage field in the chat
         await ChatModel.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
         })
         // Respond with the created message
         res.json(message)
   } catch (error) {
      res.status(400) // Respond with a 400 Bad Request status
      throw new Error(error.message) // Throw an error with the error message
   }
})

// Handler for retrieving all messages in a chat
const allMessages = asyncHandler(async(req, res) => {
   try {
      // Find all messages in a specific chat
      const messages = await MessageModel.find({ chat:req.params.chatId })
      .populate("sender","username email")
      .populate('chat')

      // Respond with the retrieved messages
      res.json(messages)
   } catch (error) {
      res.status(400) // Respond with a 400 Bad Request status
      throw new Error(error.message) // Throw an error with the error message
   }
})

export { sendMessage, allMessages }