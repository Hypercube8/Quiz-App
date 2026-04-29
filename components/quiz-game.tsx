"use client";

import JoinBoard from "./join-board";
import { useGameStore } from "@/hooks/stores/game-store";

export default function QuizGame() {
    const user = useGameStore((s) => s.user);
    const players = useGameStore((s) => s.players);

    return (
        <JoinBoard user={user!} players={players} />
    );
}