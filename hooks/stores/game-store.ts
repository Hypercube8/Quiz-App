import Player from "@/common/player";
import { create } from "zustand";

type State = {
    user?: Player;
    players: Player[];
}

type Actions = {
    setUser: (user: Player) => void;
    setPlayers: (players: Player[]) => void
}

export const useGameStore = create<State & Actions>((set) => ({
    user: undefined,
    players: [],
    setUser: (user) => set({ user }),
    setPlayers: (players) => set({ players })
}))