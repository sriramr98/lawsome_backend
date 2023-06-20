import { Server, Socket } from "socket.io";
import authorizer from "./../middlewares/authorizer";

interface UserSocket extends Socket {
  user?: any;
}

interface SocketMessage {
  msg: string;
  chat_id: string;
}

function initSocket(io: Server) {
  io.use(async (socket: UserSocket, next) => {
    const { token } = socket.handshake.auth || {};
    if (!token) {
      return next(new Error("Authentication error"));
    }

    const user = await authorizer.extractUserFromToken(token);
    if (!user) {
      return next(new Error("Authentication error"));
    }

    socket.user = user;

    next();
  });

  io.on("connection", (socket: UserSocket) => {
    const user = socket.user;
    console.log("user connected", user);

    socket.on("chat:msg", (msg: SocketMessage) => {
      console.log("chat:msg", msg);
      socket.send(msg);
    });
  });

  io.on("disconnect", () => {
    console.log("user disconnected");
  });
}

export default initSocket;
