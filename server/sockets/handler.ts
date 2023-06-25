
import { Server, Socket } from "socket.io";
import { BufferWindowMemory } from 'langchain/memory'
import authorizer from './../middlewares/authorizer'
import { SocketMessage, UserSocket } from './types'
import chatRepo from './../repo/chat';
import AI from '../core/chat.service'
import getOpenAI from "../core/ai";
import getPineconeStore from "../core/pinecone";

const USER_CHAT_HISTORY = new Map<string, BufferWindowMemory>()

async function onNewConnection(socket: UserSocket, next: any) {
  const { token } = socket.handshake.auth || {};
  if (!token) {
    return next(new Error("Authentication error"));
  }

  const user = await authorizer.extractUserFromToken(token);
  if (!user) {
    return next(new Error("Authentication error"));
  }

  // ONLY FOR TESTING
  // socket.user = { "iss": "https://securetoken.google.com/lawsomeai", "aud": "lawsomeai", "auth_time": 1687332574, "user_id": "jD7eF2XwFDPAGxe7NA44uLhOGp63", "sub": "jD7eF2XwFDPAGxe7NA44uLhOGp63", "iat": 1687332574, "exp": 1687336174, "email": "test@gmail.com", "email_verified": false, "firebase": { "identities": { "email": ["test@gmail.com"] }, "sign_in_provider": "password" }, "uid": "jD7eF2XwFDPAGxe7NA44uLhOGp63" }

  const model = getOpenAI()
  const store = await getPineconeStore()


  socket.userAI = new AI(model, store)
  // socket.user = user;

  next();
}

function getNewChatMsgHandler(socket: UserSocket) {
  return async function (msg: SocketMessage) {
    // Fetch chat History
    console.log('fetching chat history..')

    console.log('chatting with aI...')
    const chat_history = await chatRepo.getChatHistory(socket.user.user_id, msg.chat_id)

    if (!socket.userAI) {
      throw new Error('AI not initialized')
    }

    const resp = await socket.userAI.chatWithAI(msg.msg, chat_history);

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