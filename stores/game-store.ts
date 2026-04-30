import Player from "@/common/player";
import { createStore, StoreApi } from "zustand";

type State = {
    user?: Player
    players: Player[]
}

type Actions = {
    setUser: (user: Player) => void
    setPlayers: (players: Player[]) => void
    addPlayer: (player: Player) => void;
}

export type GameStore = StoreApi<State & Actions>;

export const gameStore: GameStore = createStore<State & Actions>((set) => ({
    user: undefined,
    players: [],
    setUser: (user) => set({ user }),
    setPlayers: (players) => set({ players }),
    addPlayer: (player) => set((state) => ({
        players: [...state.players, player]
    }))
}))