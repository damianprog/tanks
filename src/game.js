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
        this.currentLevelEnemiesLeft = 22;
        this.initializeDefaults();
        this.loadEagleImg();
        this.loadAudio();
    }

    loadEagleImg() {
        this.eagleImg = new Image();
        this.eagleImg.src = "/assets/images/eagle.png";
    }

    loadAudio() {
        this.playerExplodeAudio = new Audio('/assets/sounds/player-explode.wav');
        this.enemyExplodeAudio = new Audio('/assets/sounds/enemy-explode.wav');
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
        const enemy1 = new Enemy(this, new Position(89, 5));
        const enemy2 = new Enemy(this, new Position(170, 5));
        const enemy3 = new Enemy(this, new Position(408, 5));

        this.enemies = [enemy1, enemy2, enemy3];
    }

    getRandomEnemyPosition() {
        let enemyPosition;

        const roll = Math.random();

        if (roll < 0.33) {
            enemyPosition = new Position(89, 5);
        } else if (roll >= 0.33 && roll < 0.66) {
            enemyPosition = new Position(170, 5);
        } else {
            return enemyPosition = new Position(408, 5);
        }

        return enemyPosition;
    }

    spawnEnemy() {
        const newEnemy = new Enemy(this, this.getRandomEnemyPosition());
        this.enemies.push(newEnemy);
    }

    initializeSpawnEnemyInterval() {
        this.enemySpawnInterval = setInterval(() => {
            if (this.enemies.length < 4) {
                this.spawnEnemy();
            }
        }, 5000);
    }

    initializeDefaults() {
        this.initializeBoard();
        this.initializeEnemies();
        this.initializeSpawnEnemyInterval();
        this.levelQty = document.querySelector('.level-qty');
        this.livesQty = document.querySelector('.lives-qty');
        this.scoreQty = document.querySelector('.score-qty');
        this.bestScoreQty = document.querySelector('.best-score-qty');
        this.enemiesLeftQty = document.querySelector('.enemies-left-qty');

        this.levelQty.innerHTML = this.currentLevel;
        this.livesQty.innerHTML = this.player.lives;
        this.scoreQty.innerHTML = this.currentScore;
        this.enemiesLeftQty.innerHTML = this.currentLevelEnemiesLeft;

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

        if (this.eagleImg) {
            ctx.drawImage(this.eagleImg, 279, 559, 42, 42);
        }
    }

    resolveGameOver() {
        if (this.player.lives == 0) {
            console.log('Game Over.');
        }
    }

    isEnemySpawnTimePassed() {
        return new Date() - this.lastShoot >= 5000;
    }

    removeMarkedObjects() {
        this.missiles = this.missiles.filter(missile => !missile.markedForDeletion);
        this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion)
        this.allBlocks = this.allBlocks.filter(block => !block.markedForDeletion);
    }

    updateObjects(deltaTime) {
        this.player.update(deltaTime);
        this.enemies.forEach(enemy => enemy.update(deltaTime));
        this.missiles.forEach(missile => missile.update(deltaTime));
    }

    detectMissileWithMissileCollision(missile, deltaTime) {
        this.missiles.forEach(otherMissile => {
            if (otherMissile != missile && collisionDetection(missile, otherMissile, deltaTime)) {
                missile.markedForDeletion = true;
                otherMissile.markedForDeletion = true;
            }
        });
    }

    detectMissileWithBlocksCollision(missile, deltaTime) {
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
    }

    detectMissilePlayerEnemyCollision(missile, deltaTime) {
        if (missile.isEnemy) {
            if (collisionDetection(missile, this.player, deltaTime)) {
                this.playerExplodeAudio.play();
                missile.markedForDeletion = true;
                this.player.lives--;
                this.livesQty.innerHTML = this.player.lives;
                this.resolveGameOver();
            }
        } else {
            this.enemies.forEach(enemy => {
                if (collisionDetection(missile, enemy, deltaTime)) {
                    this.enemyExplodeAudio.play();
                    enemy.markedForDeletion = true;
                    missile.markedForDeletion = true;
                    this.currentScore += 100;
                    this.currentLevelEnemiesLeft--;
                    this.scoreQty.innerHTML = this.currentScore;
                    this.enemiesLeftQty.innerHTML = this.currentLevelEnemiesLeft;
                }
            })
        }
    }

    detectMissileCollisions(deltaTime) {
        this.missiles.forEach(missile => {
            this.detectMissileWithMissileCollision(missile, deltaTime);
            this.detectMissileWithBlocksCollision(missile, deltaTime);
            this.detectMissilePlayerEnemyCollision(missile, deltaTime);
        });
    }

    update(deltaTime) {
        this.updateObjects(deltaTime);
        this.removeMarkedObjects();
        this.detectMissileCollisions(deltaTime);
    }

    clear(ctx) {
        ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
    }
}