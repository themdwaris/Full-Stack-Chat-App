import { chatModel } from "../models/chatModel.js";

const getConversation = async(currentUserId)=>{
    
    if (currentUserId) {
          const currentUserConversation = await chatModel
            .find({
              $or: [{ sender: currentUserId }, { receiver: currentUserId }],
            })
            .sort({ updatedAt: -1 })
            .populate("messages")
            .populate("sender")
            .populate("receiver");
    
          const conversation = currentUserConversation?.map((chat) => {
            const unreadCount = chat?.messages?.reduce(
              (prev, current) => {
                if(current?.messageByUserId?.toString()!==currentUserId){
                  return prev + (current?.seen ? 0 : 1)
                }else{
                  return prev
                }
              },
              0
            );
            return {
              _id: chat?._id,
              sender: chat?.sender,
              receiver: chat?.receiver,
              unreadMsg: unreadCount,
              lastMsg: chat?.messages[chat?.messages?.length - 1],
            };
          });
          
          return conversation
        }else{
            return []
        }
}

export {getConversation}