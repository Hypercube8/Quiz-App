"use client";

import { useStore } from "zustand";
import JoinBoard from "./join-board";
import { gameStore } from "@/stores/game-store";

export default function QuizGame() {
    const user = useStore(gameStore, (s) => s.user);
    const players = useStore(gameStore, (s) => s.players);

    return (
        <JoinBoard user={user!} players={players} />
    );
}