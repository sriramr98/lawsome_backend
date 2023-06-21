
import { Server, Socket } from "socket.io";
import authorizer from './../middlewares/authorizer'
import { SocketMessage, UserSocket } from './types'
import chatRepo from './../repo/chat';

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
    const chat_history = await chatRepo.getChatHistory(socket.user.user_id, msg.chat_id)

    // chat with AI
    const resp = await chatWithAI(chat_history)

    // update chat history
    await chatRepo.addNewChatResponse(socket.user.user_id, msg.chat_id, resp)

    // Send response to client
    socket.emit('chat:resp', { msg, user: socket.user })
  }
}

export default {
    onNewConnection,
    getNewChatMsgHandler
}