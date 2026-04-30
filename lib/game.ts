import { GameStore, gameStore } from "@/stores/game-store";
import { socket, SocketConnection } from "./socket";
import Player from "@/common/player";

export class Game {
    connect(auth: any) {
        this.connection.connect(auth);
    }

    constructor(private store: GameStore, private connection: SocketConnection) {
        this.handleInit = this.handleInit.bind(this);
        this.handlePlayerJoin = this.handlePlayerJoin.bind(this);

        this.connection.on("game:init", this.handleInit);
        this.connection.on("game:playerJoined", this.handlePlayerJoin);
    }

    private handleInit(players: Player[]) {  
        this.store.getState().setPlayers(players);
    }

    private handlePlayerJoin(player: Player) {
        this.store.getState().addPlayer(player);
    }

    private handlePlayerLeft(player: Player) {
        
    }
}

export const game = new Game(gameStore, socket);