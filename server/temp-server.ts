// import { createServer } from "http";
// import { Server } from "socket.io";
const http = require("http");
const { Server } = require("socket.io");

const httpServer = http.createServer();
const io = new Server(httpServer, {
    /* options */
});

io.on("connect", (socket) => {
    // console.log(socket.id, "connected");
    // socket.emit("chat:resp", { answer: "hello client" });
    socket.on("chat:msg", (msg) => {
        console.log("message aaya server pr", msg);
        socket.emit("chat:resp", { answer: Math.random() * 10000 + "" });
        // socket.emit('msg', 'hiiiiiiiii')
        // socket.emit("thanks");
    });
});

httpServer.listen(4000);
