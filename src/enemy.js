import Position from './position.js'
import { MOVING_DIRECTION } from './moving-direction.js'
import Missile from './missile.js';

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

    collisionDetection(object, deltaTime) {
        let objectSpeedX = object.speedX ? object.speedX * deltaTime : 0;
        let objectSpeedY = object.speedY ? object.speedY * deltaTime : 0;

        if (this.position.x + this.speedX * deltaTime + this.size >= object.position.x + objectSpeedX
            && this.position.x + this.speedX * deltaTime <= object.position.x + objectSpeedX + object.size
            && this.position.y + this.speedY * deltaTime + this.size >= object.position.y + objectSpeedY
            && this.position.y + this.speedY * deltaTime <= object.position.y + objectSpeedY + object.size) {
            return true;
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

        if (this.position.x + this.size + this.speedX * deltaTime > 600
            || this.position.y + this.size + this.speedY * deltaTime > 600
            || this.position.x + this.speedX * deltaTime < 0
            || this.position.y + this.speedY * deltaTime < 0
        ) {
            collisionDetected = true;
            this.setNewDirectionChangeSpeed();
        }

        this.game.allBlocks.forEach(block => {
            if (this.collisionDetection(block, deltaTime)) {
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