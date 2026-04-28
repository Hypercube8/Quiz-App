"use client";

import useSocket from "@/hooks/use-socket";
import { useEffect, useState } from "react";
import { JoinBoard } from "./quiz";

interface Player {
    name: string;
    email: string;
    avatar?: string;
}

export default function QuizGame() {
    const { socket, connected } = useSocket()!;
    
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        if (!connected) { return; }

        function handleInit(players: Player[]) {
            alert(players);
            setPlayers(players);
        }

        socket.on("game:init", handleInit);  

        socket.emit("join");

        return () => {
            socket.off("game:init", handleInit);
        }
    }, [connected]);

    return (
        <JoinBoard players={players} />
    );
}