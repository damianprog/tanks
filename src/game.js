import Enemy from "./enemy.js";
import Input from "./input.js";
import Player from "./player.js";
import Position from "./position.js";
import Missile from "./missile.js";
import BrickBlock from "./brick-block.js";
import EagleBlock from "./eagle-block.js";
import collisionDetection from "./collision-detection.js";
import { Board } from "./board.js";

export default class Game {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.player = new Player(this);
        this.input = new Input(this);
        this.isEagleShot = false;
        this.currentLevel = 1;
        this.currentScore = 0;
        this.initializeDefaults();
    }

    initializeBoard() {
        const allBrickBlocks = [];
        const allEagleBlocks = [];

        let currentIndex = 0;
        for (let row = 0; row < 30; row++) {

            for (let col = 0; col < 30; col++) {
                if (Board[currentIndex] === 1) {
                    allBrickBlocks.push(new BrickBlock(this, new Position(col * 20, row * 20)));
                } else if (Board[currentIndex] === 2) {
                    allEagleBlocks.push(new EagleBlock(this, new Position(col * 20, row * 20)));
                }
                currentIndex++;
            }

        }

        this.allBrickBlocks = allBrickBlocks;
        this.allEagleBlocks = allEagleBlocks;
        this.allBlocks = [...allBrickBlocks, ...allEagleBlocks];
    }

    initializeEnemies() {
        this.enemies = [];
        const enemy1 = new Enemy(this, new Position(89, 5));
        const enemy2 = new Enemy(this, new Position(170, 5));
        const enemy3 = new Enemy(this, new Position(408, 5));

        this.enemies.push(enemy1);
        this.enemies.push(enemy2);
        this.enemies.push(enemy3);
    }

    initializeDefaults() {
        this.initializeBoard();
        this.initializeEnemies();
        this.levelQty = document.querySelector('.level-qty');
        this.livesQty = document.querySelector('.lives-qty');
        this.scoreQty = document.querySelector('.score-qty');
        this.bestScoreQty = document.querySelector('.best-score-qty');

        this.levelQty.innerHTML = this.currentLevel;
        this.livesQty.innerHTML = this.player.lives;
        this.scoreQty.innerHTML = this.currentScore;

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
        this.allBlocks.filter(block => block.draw(ctx));
    }

    resolveGameOver() {
        if (this.player.lives == 0) {
            console.log('Game Over.');
        }
    }

    update(deltaTime) {
        this.player.update(deltaTime);
        this.enemies.forEach(enemy => enemy.update(deltaTime));
        this.missiles = this.missiles.filter(missile => !missile.markedForDeletion);
        this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion)
        this.allBlocks = this.allBlocks.filter(block => !block.markedForDeletion);
        this.missiles.forEach(missile => missile.update(deltaTime));


        // for (let i = 0; i < this.missiles.length; i++) {

        // }

        this.missiles.forEach(missile => {
            if (missile.isEnemy) {
                if (collisionDetection(missile, this.player, deltaTime)) {
                    missile.markedForDeletion = true;
                    this.player.lives--;
                    this.livesQty.innerHTML = this.player.lives;
                    this.resolveGameOver();
                }
            } else {
                this.enemies.forEach(enemy => {
                    if (collisionDetection(missile, enemy, deltaTime)) {
                        enemy.markedForDeletion = true;
                        missile.markedForDeletion = true;
                        this.currentScore += 100;
                        this.scoreQty.innerHTML = this.currentScore;
                    }
                })
            }

            this.missiles.forEach(otherMissile => {
                if (otherMissile != missile && collisionDetection(missile, otherMissile, deltaTime)) {
                    missile.markedForDeletion = true;
                    otherMissile.markedForDeletion = true;
                }
            });

            // checking if missile is not marked for deletion for not breaking two blocks at once
            this.allBlocks.forEach(block => {
                if (collisionDetection(missile, block, deltaTime) && !missile.markedForDeletion) {
                    block.markedForDeletion = true;
                    missile.markedForDeletion = true;
                    if (block instanceof EagleBlock) {
                        this.player.lives = 0;
                        this.resolveGameOver();
                    }
                }
            });
        });
    }

    clear(ctx) {
        ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
    }
}