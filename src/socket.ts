"use client";

import { io, Socket } from "socket.io-client";

const URL = process.env.NODE_ENV === "production" ? undefined : "ws://localhost:3001";

export const socket = io(URL, {
    autoConnect: false
})