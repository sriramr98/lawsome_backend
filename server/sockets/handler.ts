
import { Server, Socket } from "socket.io";
import authorizer from './../middlewares/authorizer'
import { SocketMessage, UserSocket } from './types'
import chatRepo from './../repo/chat';
import ai from './../core/ai'

async function onNewConnection(socket: UserSocket, next: any) {
    // const { token } = socket.handshake.auth || {};
    // if (!token) {
    //   return next(new Error("Authentication error"));
    // }

    // const user = await authorizer.extractUserFromToken(token);
    // if (!user) {
    //   return next(new Error("Authentication error"));
    // }

    // ONLY FOR TESTING
    socket.user = {"iss":"https://securetoken.google.com/lawsomeai","aud":"lawsomeai","auth_time":1687332574,"user_id":"jD7eF2XwFDPAGxe7NA44uLhOGp63","sub":"jD7eF2XwFDPAGxe7NA44uLhOGp63","iat":1687332574,"exp":1687336174,"email":"test@gmail.com","email_verified":false,"firebase":{"identities":{"email":["test@gmail.com"]},"sign_in_provider":"password"},"uid":"jD7eF2XwFDPAGxe7NA44uLhOGp63"}
    // socket.user = user;

    next();
}

function getNewChatMsgHandler(socket: UserSocket) {
  return async function(msg: SocketMessage) {
    // Fetch chat History
    console.log('fetching chat history..')
    const chat_history = await chatRepo.getChatHistory(socket.user.user_id, msg.chat_id)

    console.log('chatting with aI...')
    // chat with AI
    const resp = await ai.chatWithAI(chat_history, msg.msg)

    console.log('updating chat history...')
    // update chat history
    await chatRepo.addNewChatResponse(socket.user.user_id, msg.chat_id, resp.msg, msg.msg)

    // Send response to client
    socket.emit('chat:resp', { question: msg.msg, answer: resp.msg })
  }
}

export default {
    onNewConnection,
    getNewChatMsgHandler
}