import Input from "./input.js";
import Player from "./player.js";

export default class Game {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.player = new Player(this);
        this.input = new Input(this);
    }

    draw(ctx) {
        this.player.draw(ctx);
    }

    update(deltaTime) {
        this.player.update(deltaTime);
    }

    clear(ctx) {
        ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
    }
}