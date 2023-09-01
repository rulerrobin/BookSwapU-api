import asyncHandler from 'express-async-handler'
import express from 'express'
import { ChatModel, MessageModel } from "../models/chatModel.js"
import { UserModel } from "../models/userModel.js"


const sendMessage= asyncHandler(async (req, res) => {
   const {content, chatId} = req.body

   if (!content || !chatId ) {
      console.log("Invalid data passed into request")
      return res.sendStatus(400)
   }

   var newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId
   }

   try {
      var message = await MessageModel.create(newMessage)

      message = await message.populate("sender", "username")
      message = await message.populate("chat",)
      message = await UserModel.populate(message, {
         path: 'chat.users',
         select: 'username email'
      })

         await ChatModel.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
         })

         res.json(message)
   } catch (error) {
      res.status(400)
      throw new Error(error.message)
   }
})

const allMessages = asyncHandler(async(req, res) => {
   try {
      const messages = await MessageModel.find({ chat:req.params.chatId })
      .populate("sender","username email")
      .populate('chat')

      res.json(messages)
   } catch (error) {
      res.status(400)
      throw new Error(error.message)
   }
})

export { sendMessage, allMessages }