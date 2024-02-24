import Position from './position.js'
import { MOVING_DIRECTION } from './moving-direction.js'
import Missile from './missile.js';
import collisionDetection from './collision-detection.js';
import boardBoundariesCollisionDetection from './board-boundaries-collision-detection.js';

export default class Enemy {
    constructor(game, position) {
        this.game = game;
        this.size = 30;
        this.position = position;
        this.speedX = 0;
        this.speedY = 0;
        this.currentMovingDirection = MOVING_DIRECTION.RIGHT;
        this.missiles = [];
        this.lastDirectionChange = 0;
        this.lastShoot = 0;
        this.markedForDeletion = false;
        this.moveRight();
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.position.x, this.position.y, this.size, this.size);
        ctx.fillStyle = "#363636";
        ctx.fill();
    }

    isDirectionChangeTimePassed() {
        return new Date() - this.lastDirectionChange >= 3000;
    }

    isShootTimePassed() {
        return new Date() - this.lastShoot >= 2000;
    }

    setNewDirectionChangeSpeed() {
        const roll = Math.random();

        if (roll < 0.25) {
            this.moveLeft();
        } else if (roll >= 0.25 && roll < 0.5) {
            this.moveRight();
        } else if (roll >= 0.5 && roll < 0.75) {
            this.moveUp();
        } else {
            this.moveDown();

        }
    }

    update(deltaTime) {

        let collisionDetected = false;

        if (this.isDirectionChangeTimePassed()) {
            this.lastDirectionChange = new Date();
            this.setNewDirectionChangeSpeed();
        }

        if (this.isShootTimePassed()) {
            this.lastShoot = new Date();
            this.shoot();
        }

        if (boardBoundariesCollisionDetection(this, deltaTime)) {
            collisionDetected = true;
            this.setNewDirectionChangeSpeed();
        }

        this.game.allBlocks.forEach(block => {
            if (collisionDetection(this, block, deltaTime)) {
                collisionDetected = true;
                this.setNewDirectionChangeSpeed();
            }
        });

        if (!collisionDetected) {
            this.position.x = this.position.x + this.speedX * deltaTime;
            this.position.y = this.position.y + this.speedY * deltaTime;
        }

    }

    shoot() {
        const missilePosition = new Position(this.position.x + 15 - Missile.size / 2, this.position.y + 15 - Missile.size / 2);
        this.game.createMissile(missilePosition, this.currentMovingDirection, true);
    }

    moveLeft() {
        this.speedY = 0;
        this.speedX = -0.05;
        this.currentMovingDirection = MOVING_DIRECTION.LEFT;
    }

    moveRight() {
        this.speedY = 0;
        this.speedX = 0.05;
        this.currentMovingDirection = MOVING_DIRECTION.RIGHT;
    }

    moveUp() {
        this.speedX = 0;
        this.speedY = -0.05;
        this.currentMovingDirection = MOVING_DIRECTION.UP;
    }

    moveDown() {
        this.speedX = 0;
        this.speedY = 0.05;
        this.currentMovingDirection = MOVING_DIRECTION.DOWN;
    }

    stop() {
        this.speedX = 0;
        this.speedY = 0;
    }
}