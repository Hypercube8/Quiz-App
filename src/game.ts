import { GameStore, useGameStore } from "@/hooks/stores/game-store";
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
        this.store.setState({
            players
        });
    }
}

export const game = new Game(useGameStore, socket);