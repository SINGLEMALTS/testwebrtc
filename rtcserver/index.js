const express = require("express");
const { SocketAddress } = require("net");
const app = express();
const server = require("http").createServer(app);
// const io = require("socket.io")(server);
const io = require("socket.io")(server, {
    // cors: {
    //     origin: "http://localhost:3002",
    //     methods: ["GET", "POST"],
    //     credentials: true,
    // },
    // allowEIO3: true,
    cors: {
        origin: "*",
    },
});
const cors = require("cors");
app.use(cors());
// static file setting
app.use(express.static("public"));

io.on("connection", (socket) => {
    socket.on("join", (roomname) => {
        console.log("join !!");
        const rooms = io.of("/").adapter.rooms;
        const room = rooms.get(roomname);

        if (room == undefined) {
            socket.join(roomname);
            socket.emit("created");
            console.log(socket.rooms);
            console.log("room is undefined");
        } else if (room?.size == 1) {
            socket.join(roomname);
            console.log(socket.rooms);
            console.log("room size is 1");
            socket.emit("joined");
        } else {
            console.log("server : room is full");
            socket.emit("full");
        }
        socket.on("ready", (room) => {
            console.log("server is ready");
            socket.to(room).emit("ready");
            console.log("it working");
        });
        socket.on("offer", (offer, room) => {
            console.log("server is ready");
            socket.to(room).emit("offer", offer);
        });
        socket.on("answer", (answer, room) => {
            console.log("server is answer");
            socket.to(room).emit("answer", answer);
        });
        socket.on("candidate", (candidate, room) => {
            console.log("server is Candidate");
            socket.to(room).emit("candidate", candidate);
        });
    });
});

server.listen(3002, () => {
    console.log("Server Running At http://localhost:3002/");
});
