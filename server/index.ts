import express from "express";
import http from "http";
import { Server } from "socket.io";

import initRoutes from "./routes/init";
import initSocket from "./sockets/init";
import initFirebase from "./config/firebase";

const app = express();
const server = http.createServer(app);

initFirebase();

const io = new Server(server);
initSocket(io);

app.use(initRoutes);

server.listen(3000, () => {
  console.log("listening on *:3000");
});
