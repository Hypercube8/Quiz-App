import { SocketContext } from "@/components/socket-provider";
import { useContext } from "react";

export default function useSocket() {
    return useContext(SocketContext);
}