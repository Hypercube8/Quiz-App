import { createStore, StoreApi } from "zustand";

type State = {
    connected: boolean
    connecting: boolean
    error: Error | null
}

export type SocketStore = StoreApi<State>;

export const socketStore = createStore<State>((set) => ({
    connected: false,
    connecting: false,
    error: null
}))