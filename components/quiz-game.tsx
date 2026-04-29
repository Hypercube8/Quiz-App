"use client";

import Player from "@/common/player";
import useSocket from "@/hooks/use-socket";
import { useEffect, useRef, useState } from "react";
import JoinBoard from "./join-board";
import { useGameStore } from "@/hooks/stores/game-store";
import { shallow } from "zustand/shallow";

export default function QuizGame() {
    const { socket, connected } = useSocket()!;
    
    const user = useGameStore((s) => s.user);
    const players = useGameStore((s) => s.players);
    const setPlayers = useGameStore((s) => s.setPlayers);

    const hasJoined = useRef(false);

    useEffect(() => {
        if (!connected) { return; }

        function handleInit(players: Player[]) {
            setPlayers(players);
        }

        socket.on("game:init", handleInit);  

        if (!hasJoined.current) {
            socket.emit("join");
            hasJoined.current = true;
        }

        return () => {
            socket.off("game:init", handleInit);
        }
    }, [connected]);

    return (
        <JoinBoard user={user!} players={players} />
    );
}