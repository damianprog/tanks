import Position from './position.js'
import { MOVING_DIRECTION } from './moving-direction.js'
import Missile from './missile.js';

export default class Player {
    constructor(game) {
        this.game = game;
        this.size = 30;
        this.position = new Position(300, 280);
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

    collisionDetection(object, objectPosition, deltaTime) {
        let objectSpeedX = object.speedX ? object.speedX * deltaTime : 0;
        let objectSpeedY = object.speedY ? object.speedY * deltaTime : 0;

        if (this.position.x + this.speedX * deltaTime + this.size >= objectPosition.x + objectSpeedX
            && this.position.x + this.speedX * deltaTime <= objectPosition.x + objectSpeedX + object.size
            && this.position.y + this.speedY * deltaTime + this.size >= objectPosition.y + objectSpeedY
            && this.position.y + this.speedY * deltaTime <= objectPosition.y + objectSpeedY + object.size) {
            return true;
        }
    }

    checkCollisionWithBlocks(deltaTime) {
        this.game.allBlocks.forEach(block => {
            if (this.collisionDetection(block, block.position, deltaTime)) {
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