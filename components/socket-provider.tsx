"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { socket } from "../src/socket";

interface SocketState {
    socket: Socket;
    connected: boolean;
    connecting: boolean;
    error: Error | null;
    connect: (auth: any) => void; 
}

export const SocketContext = createContext<SocketState | null>(null);

export default function SocketProvider({children}: React.PropsWithChildren) {
    const [connected, setConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    function connect(auth: any) {
        socket.auth = auth; 
        setConnecting(true);
        setError(null);
        socket.connect();
    }

    useEffect(() => {
        function handleConnect() {
            setConnected(true);
            setConnecting(false);
            setError(null);
        }

        function handleDisconnect() {
            setConnected(false);
        }

        function handleConnectError(err: Error) {
            setError(err);
            setConnecting(false);
            setConnected(false);
        }

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);

        socket.on("connect_error", handleConnectError)

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("connect_error", handleConnectError);
        }
    }, []);

    return (
        <SocketContext.Provider value={
            {
                socket,
                connected,
                connecting,
                error,
                connect,         
            }
        }>
            {children}
        </SocketContext.Provider>
    );    
}