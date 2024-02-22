import Enemy from "./enemy.js";
import Input from "./input.js";
import Player from "./player.js";
import Position from "./position.js";
import Missile from "./missile.js";
import BrickBlock from "./brickBlock.js";
import { Board } from "./board.js";

export default class Game {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.player = new Player(this);
        this.input = new Input(this);
        this.initializeBoard();
        this.initializeDefaults();
    }

    initializeBoard() {
        const allBrickBlocks = [];
        let currentIndex = 0;
        for (let row = 0; row < 30; row++) {

            for (let col = 0; col < 30; col++) {
                if (Board[currentIndex] === 1) {
                    allBrickBlocks.push(new BrickBlock(this, new Position(col * 20, row * 20)));
                }
                currentIndex++;
            }

        }

        this.allBrickBlocks = allBrickBlocks;
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

    createMissile(missilePosition, missileDirection, isEnemy = false) {
        const missile = new Missile(missilePosition, missileDirection, isEnemy);
        this.missiles.push(missile);
    }

    draw(ctx) {
        this.player.draw(ctx);
        this.enemies.forEach(enemy => enemy.draw(ctx));
        this.missiles.forEach(missile => missile.draw(ctx));
        this.allBrickBlocks.forEach(brickBlock => brickBlock.draw(ctx));
    }

    collisionDetection(object1, object2) {
        if (object1.position.x + object1.size >= object2.position.x
            && object1.position.x <= object2.position.x + object2.size
            && object1.position.y + object1.size >= object2.position.y
            && object1.position.y <= object2.position.y + object2.size) {
            return true;
        }
    }
    update(deltaTime) {
        this.player.update(deltaTime);
        this.enemies.forEach(enemy => enemy.update(deltaTime));
        this.missiles = this.missiles.filter(missile => !missile.markedForDeletion);
        this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion)
        this.missiles.forEach(missile => missile.update(deltaTime));


        this.missiles.forEach(missile => {
            if (missile.isEnemy) {
                if (this.collisionDetection(missile, this.player)) {
                    console.log('Player dead!');
                }
            } else {
                this.enemies.forEach(enemy => {
                    if (this.collisionDetection(missile, enemy)) {
                        enemy.markedForDeletion = true;
                        missile.markedForDeletion = true;
                    }
                })
            }
        });
    }

    clear(ctx) {
        ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
    }
}