import { Server } from "socket.io";

function initSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log("a user connected");
    console.log({ handshake: socket.handshake });
  });

  io.on("disconnect", () => {
    console.log("user disconnected");
  });
}

export default initSocket;
