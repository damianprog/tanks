import Enemy from "./enemy.js";
import Input from "./input.js";
import Player from "./player.js";
import Position from "./position.js";
import Missile from "./missile.js";

export default class Game {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.player = new Player(this);
        this.input = new Input(this);
        this.initializeDefaults();
    }

    initializeDefaults() {
        this.enemies = [];
        const enemy1 = new Enemy(this, new Position(110, 290));
        const enemy2 = new Enemy(this, new Position(300, 50));
        const enemy3 = new Enemy(this, new Position(493, 290));

        this.enemies.push(enemy1);
        this.enemies.push(enemy2);
        this.enemies.push(enemy3);

        this.missiles = [];
    }

    createMissile(missilePosition, missileDirection) {
        const missile = new Missile(missilePosition, missileDirection);
        this.missiles.push(missile);
    }

    draw(ctx) {
        this.player.draw(ctx);
        this.enemies.forEach(enemy => enemy.draw(ctx));
        this.missiles.forEach(missile => missile.draw(ctx));
    }

    update(deltaTime) {
        this.player.update(deltaTime);
        this.enemies.forEach(enemy => enemy.update(deltaTime));
        this.missiles = this.missiles.filter(missile => !missile.markedForDeletion);
        this.missiles.forEach(missile => missile.update(deltaTime));

    }

    clear(ctx) {
        ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
    }
}