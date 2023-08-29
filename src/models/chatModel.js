import mongoose from 'mongoose'

// Define a schema for the Chat model
const chatSchema = new mongoose.Schema(
  {
    chatName: { type: String, trim: true },

    users: [
      {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      }
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message"
    },
  },
  { timestamps: true },
)
  
  // Create a Chat model from the defined schema
  const ChatModel = mongoose.model('Chat', chatSchema)
  
  // Define a schema for the Messages model
  const messageModel = new mongoose.Schema({
    // id of sender
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // content of message
    content: { type: String, trim: true},
    // reference of chat message belongs to
    chat: {type: mongoose.Schema.Types.ObjectId, ref: 'Chat'},
    },
    {
      timestamps: true,
    }
  )
  
  const MessageModel = mongoose.model('Message', messageModel)
  
  export { ChatModel, MessageModel }
