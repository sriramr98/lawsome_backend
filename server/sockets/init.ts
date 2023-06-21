import { Server } from "socket.io";
import socketHandler from './handler'
import { UserSocket } from './types'

function initSocket(io: Server) {
  io.use(socketHandler.onNewConnection);

  io.on("connection", (socket: UserSocket) => {
    const user = socket.user;
    console.log("user connected", user);

    socket.on("chat:msg", socketHandler.getNewChatMsgHandler(socket));
  });
}

export default initSocket;
