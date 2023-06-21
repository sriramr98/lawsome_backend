
import { Socket } from "socket.io";

export interface UserSocket extends Socket {
  user?: any;
}

export interface SocketMessage {
  msg: string;
  chat_id: string;
}
