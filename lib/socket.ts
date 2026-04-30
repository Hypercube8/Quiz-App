import { SocketStore, socketStore } from "@/stores/socket-store";
import { io, Socket } from "socket.io-client";

const URL = process.env.NODE_ENV === "production" ? undefined : "ws://localhost:3001";

export class SocketConnection {
    socket = io(URL, {
        autoConnect: false
    })
    
    constructor(private store: SocketStore) {
        this.handleConnect = this.handleConnect.bind(this);
        this.handleDisconnect = this.handleDisconnect.bind(this);
        this.handleConnectError = this.handleConnectError.bind(this);

        this.socket.on("connect", this.handleConnect);
        this.socket.on("disconnect", this.handleDisconnect);
        this.socket.on("connect_error", this.handleConnectError);
    }

    connect(auth: any) {
        this.socket.auth = auth;
        this.store.setState({
            connected: false,
            connecting: true
        })
        this.socket.connect();
    }

    private handleConnect() {
        this.store.setState({
            connected: true,
            connecting: false,
            error: null
        }) 
    }

    private handleDisconnect() {
        this.store.setState({
            connected: false,
            connecting: false
        })
    }

    private handleConnectError(err: Error) {
        this.store.setState({
            connected: false,
            connecting: false,
            error: err
        })
    }

    on(event: string, handler: (...args: any[]) => void) {
        this.socket.on(event, handler);
    }

    disconnect() {
        this.store.setState({
            connected: false,
            connecting: false
        });
        this.socket.disconnect();
    } 
}

export const socket = new SocketConnection(socketStore);