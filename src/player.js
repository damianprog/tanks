import Position from './position.js'
import { MOVING_DIRECTION } from './moving-direction.js'
import Missile from './missile.js';
import collisionDetection from './collision-detection.js';

export default class Player {
    constructor(game) {
        this.game = game;
        this.size = 30;
        this.position = new Position(285, 465);
        this.speedX = 0;
        this.speedY = 0;
        this.currentMovingDirection = MOVING_DIRECTION.RIGHT;
        this.missiles = [];
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.position.x, this.position.y, this.size, this.size);
        ctx.fillStyle = "#00FF00";
        ctx.fill();
    }

    checkCollisionWithBlocks(deltaTime) {
        this.game.allBlocks.forEach(block => {
            if (collisionDetection(this, block, deltaTime)) {
                this.speedX = 0;
                this.speedY = 0;
            }
        });
    }

    update(deltaTime) {
        this.checkCollisionWithBlocks(deltaTime);

        this.position.x = this.position.x + this.speedX * deltaTime;
        this.position.y = this.position.y + this.speedY * deltaTime;
    }

    shoot() {
        const missilePosition = new Position(this.position.x + 15 - Missile.size / 2, this.position.y + 15 - Missile.size / 2);
        this.game.createMissile(missilePosition, this.currentMovingDirection);
    }

    moveLeft() {
        this.speedY = 0;
        this.speedX = -0.1;
        this.currentMovingDirection = MOVING_DIRECTION.LEFT;
    }

    moveRight() {
        this.speedY = 0;
        this.speedX = 0.1;
        this.currentMovingDirection = MOVING_DIRECTION.RIGHT;
    }

    moveUp() {
        this.speedX = 0;
        this.speedY = -0.1;
        this.currentMovingDirection = MOVING_DIRECTION.UP;
    }

    moveDown() {
        this.speedX = 0;
        this.speedY = 0.1;
        this.currentMovingDirection = MOVING_DIRECTION.DOWN;
    }

    stop() {
        this.speedX = 0;
        this.speedY = 0;
    }
}