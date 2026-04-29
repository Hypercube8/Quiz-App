import { GameStore, gameStore } from "@/stores/game-store";
import { socket, SocketConnection } from "./socket";
import Player from "@/common/player";

export class Game {
    connect(auth: any) {
        this.connection.connect(auth);
    }

    constructor(private store: GameStore, private connection: SocketConnection) {
        this.handleInit = this.handleInit.bind(this);

        this.connection.on("game:init", this.handleInit);
    }

    handleInit(players: Player[]) {
        this.store.getState().setPlayers(players);
    }
}

export const game = new Game(gameStore, socket);