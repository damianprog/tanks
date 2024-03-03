import Enemy from "./enemy.js";
import Input from "./input.js";
import Player from "./player.js";
import Position from "./position.js";
import Missile from "./missile.js";
import BrickBlock from "./brick-block.js";
import EagleBlock from "./eagle-block.js";
import collisionDetection from "./collision-detection.js";
import { Board } from "./board.js";
import { GAME_STATE } from "./game-states.js";

export default class Game {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.gameState = GAME_STATE.WELCOME_MENU;
        this.player = new Player(this);
        this.input = new Input(this);
        this.isEagleShot = false;
        this.currentLevel = 1;
        this.currentScore = 0;
        this.currentLevelEnemiesLeft = 21 + this.currentLevel;
        this.initializeDefaults();
        this.initializeInfoPanels();
        this.loadEagleImg();
        this.loadAudio();
    }

    loadEagleImg() {
        this.eagleImg = new Image();
        this.eagleImg.src = '/assets/images/eagle.png';
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

    start() {
        if (
            this.gameState === GAME_STATE.WELCOME_MENU ||
            this.gameState === GAME_STATE.GAME_OVER ||
            this.gameState === GAME_STATE.LEVEL
        ) {
            this.initializeDefaults();
            this.gameState = GAME_STATE.RUNNING;
        }
    }

    pause() {
        if (this.gameState === GAME_STATE.RUNNING) {
            this.gameState = GAME_STATE.PAUSED;
        } else if (this.gameState === GAME_STATE.PAUSED) {
            this.gameState = GAME_STATE.RUNNING;
        }
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
            const canSpawnEnemy = this.enemies.length < 4 &&
                this.currentLevelEnemiesLeft > this.enemies.length &&
                this.gameState != GAME_STATE.PAUSED

            if (canSpawnEnemy) {
                this.spawnEnemy();
            }
        }, 5000);
    }

    setBestScore() {
        let bestScore = this.localStorageBestScore ? parseInt(this.localStorageBestScore) : 0;

        if (this.currentScore > bestScore) {
            bestScore = this.currentScore;
        }
        this.bestScoreQty.innerHTML = bestScore;
        window.localStorage.setItem('tanksBestScore', bestScore);
    }

    setLabels() {
        this.levelQty = document.querySelector('.level-qty');
        this.livesQty = document.querySelector('.lives-qty');
        this.scoreQty = document.querySelector('.score-qty');
        this.bestScoreQty = document.querySelector('.best-score-qty');
        this.enemiesLeftQty = document.querySelector('.enemies-left-qty');
        this.gameOverScoreQty = document.querySelector('.game-over-score-qty');
        this.newBestScore = document.querySelector('.new-best-score');
        this.newBestScoreQty = document.querySelector('.new-best-score-qty');
        this.infoPanelLevelQty = document.querySelector('.info-panel-level-qty');
    }

    setLabelsDefaultQunatities() {
        this.currentLevelEnemiesLeft = 21 + this.currentLevel;
        this.levelQty.innerHTML = this.currentLevel;
        this.livesQty.innerHTML = this.player.lives;
        this.scoreQty.innerHTML = this.currentScore;
        this.enemiesLeftQty.innerHTML = this.currentLevelEnemiesLeft;
    }

    initializeDefaults() {
        this.initializeBoard();
        this.initializeEnemies();
        this.initializeSpawnEnemyInterval();
        this.player.setStartingPosition();
        this.setLabels();
        this.setLabelsDefaultQunatities();

        this.localStorageBestScore = window.localStorage.getItem(
            'tanksBestScore'
        );

        this.missiles = [];
        this.setBestScore();
    }

    initializeInfoPanels() {
        this.gameOverInfoPanel = document.querySelector('.game-over-info-panel');
        this.welcomeMenuInfoPanel = document.querySelector('.welcome-menu-info-panel');
        this.levelInfoPanel = document.querySelector('.level-info-panel');
        this.pausedInfoPanel = document.querySelector('.paused-info-panel');
    }

    createMissile(missilePosition, missileDirection, isEnemy = false) {
        const missile = new Missile(missilePosition, missileDirection, isEnemy);
        this.missiles = [...this.missiles, missile];
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
            this.resolveNewBestScore();
            this.currentLevel = 1;
            this.currentScore = 0;

            this.gameState = GAME_STATE.GAME_OVER;
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

    resolveNewBestScore() {
        if (this.currentScore > parseInt(this.localStorageBestScore)) {
            this.newBestScore.style.display = 'block';
            this.newBestScoreQty.innerHTML = this.currentScore;
        } else {
            this.newBestScore.style.display = 'none';
        }
    }

    showInfo() {
        this.welcomeMenuInfoPanel.style.display = this.gameState === GAME_STATE.WELCOME_MENU ? 'block' : 'none';
        this.gameOverInfoPanel.style.display = this.gameState === GAME_STATE.GAME_OVER ? 'block' : 'none';
        this.levelInfoPanel.style.display = this.gameState === GAME_STATE.LEVEL ? 'block' : 'none';
        this.pausedInfoPanel.style.display = this.gameState === GAME_STATE.PAUSED ? 'block' : 'none';

        if (this.gameState === GAME_STATE.LEVEL) {
            this.infoPanelLevelQty.innerHTML = this.currentLevel;
        }
        if (this.gameState === GAME_STATE.GAME_OVER) {
            this.gameOverScoreQty.innerHTML = this.scoreQty.innerHTML;
        }
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

    resolveLevelUp() {
        if (this.currentLevelEnemiesLeft == 0) {
            this.currentLevel++;
            this.gameState = GAME_STATE.LEVEL;
            setTimeout(() => this.start(), 4000);
        }
    }

    resolveEnemyHit(missile, enemy) {
        this.enemyExplodeAudio.play();
        enemy.markedForDeletion = true;
        missile.markedForDeletion = true;
        this.currentScore += 100;
        this.setBestScore();
        this.currentLevelEnemiesLeft--;
        this.scoreQty.innerHTML = this.currentScore;
        this.enemiesLeftQty.innerHTML = this.currentLevelEnemiesLeft;
        this.resolveLevelUp();
    }

    resolvePlayerHit(missile) {
        this.playerExplodeAudio.play();
        missile.markedForDeletion = true;
        this.player.lives--;
        this.livesQty.innerHTML = this.player.lives;
        this.player.setStartingPosition();
        this.resolveGameOver();
    }

    detectMissilePlayerEnemyCollision(missile, deltaTime) {
        if (missile.isEnemy) {
            if (collisionDetection(missile, this.player, deltaTime)) {
                this.resolvePlayerHit(missile);
            }
        } else {
            this.enemies.forEach(enemy => {
                if (collisionDetection(missile, enemy, deltaTime)) {
                    this.resolveEnemyHit(missile, enemy)
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
        this.showInfo();

        if (this.gameState !== GAME_STATE.RUNNING) return;
        this.updateObjects(deltaTime);
        this.removeMarkedObjects();
        this.detectMissileCollisions(deltaTime);
    }

    clear(ctx) {
        ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
    }
}