import { create, StoreApi, UseBoundStore } from "zustand";

type State = {
    connected: boolean
    connecting: boolean
    error: Error | null
}

export type SocketStore = UseBoundStore<StoreApi<State>>;

export const useSocketStore = create<State>((set) => ({
    connected: false,
    connecting: false,
    error: null
}))