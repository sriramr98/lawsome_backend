
import { Socket } from "socket.io";
import AI from "../core/chat.service";

export interface UserSocket extends Socket {
  user?: any;
  userAI?: AI;
}

export interface SocketMessage {
  msg: string;
  chat_id: string;
}