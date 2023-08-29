import AsyncHandler from 'express-async-handler'
import { ChatModel } from '../models/chatModel.js'
import { UserModel } from '../models/userModel.js'

// One on one Chat
const accessChat = AsyncHandler(async (req, res) => {
   const { userId } = req.body

   if (!userId) {
      console.log("UserID param not sent with request")
      return res.sendStatus(400)
   }

      var isChat = await ChatModel.find({
         $and: [
            { users: { $elemMatch: { $eq:req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
         ]
      }).populate('users', '-password')
            .populate('latestMessage')

         // console.log(req.user._id)
         // console.log(userId)

         isChat = await UserModel.populate(isChat, {
            path: 'latestMessage.sender',
            select: "name email",
         })

         if(isChat.length > 0){
            res.send(isChat[0])

         } else {
            var chatData = {
               chatName: "sender",
               users: [req.user._id, userId],
            }
            
            try {
               const createdChat = await ChatModel.create(chatData)

               const FullChat = await ChatModel.findOne({_id: createdChat._id})
               .populate(
                  'users',
                  '-password'
               )

               res.status(200).send(FullChat)
            } catch (error) {
               res.status(400)
               throw new Error(error.message)
            }
         }
})

const fetchChats = AsyncHandler(async (req, res,) => {
   try {
      ChatModel.find({ users: { $elemMatch: { $eq: req.user._id} } })
         .populate("users", "-password")
         .populate("latestMessage")
         .sort({updatedAt: -1})
         .then(async (results)=> {
            results = await UserModel.populate(results, {
               path: "latestMessage.sender",
               select: "name email"
            })

            res.status(200).send(results)
         })
   } catch (error) {
      res.status(400)
      throw new error(error.message)
   }
})
export { accessChat, fetchChats }