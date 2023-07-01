import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();
import initRoutes from "./routes/init";
import initSocket from "./sockets/init";
// import initFirebase from "./config/firebase";
import getSequelize from "./entities/init";

const app = express();
const server = http.createServer(app);

// initFirebase();

// required for CORS
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
initSocket(io);

app.use(initRoutes);

server.listen(8000, () => {
    getSequelize().sync();
    console.log("listening on *:8000");
});
