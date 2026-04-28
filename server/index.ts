import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.get("/", (req, res) => {
    res.send("Quiz server running");
})

interface Player {
    name: string;
    email: string;
    avatar?: string;
}

const players: Player[] = [];

io.use((socket, next) => {
    const roomCode = socket.handshake.auth.roomCode;

    if (roomCode === "123456") {
        next();
    } else {
        next(new Error("Room code is invalid."));
    }
})

io.on("connection", (socket) => {
    console.log(socket.id);
});

io.on("join", () => {
    players.push({
        name: "John",
        email: "Rando",
    })
    alert("jpon");
    io.emit("game:init", players);
})

server.listen(3001, () => {
    console.log("Sever running on http://localhost:3001");
})