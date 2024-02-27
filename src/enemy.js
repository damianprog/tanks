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
        this.currentMovingDirection = MOVING_DIRECTION.UP;
        this.missiles = [];
        this.lastDirectionChange = 0;
        this.lastShoot = 0;
        this.markedForDeletion = false;
        this.moveRight();
        this.loadBlueTankImage();
    }

    loadBlueTankImage() {
        this.blueTankImg = new Image();
        this.blueTankImg.src = "/assets/images/blue-tank.png";
    }

    getCurrentMovingDirectionAngle() {
        switch (this.currentMovingDirection) {
            case 'right':
                return 270;
            case 'down':
                return 0;
            case 'left':
                return 90;
            case 'up':
                return 180;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.position.x + this.size / 2, this.position.y + this.size / 2);
        ctx.rotate((this.getCurrentMovingDirectionAngle() * Math.PI) / 180);
        ctx.translate((this.position.x + this.size / 2) * -1, (this.position.y + this.size / 2) * -1);

        if (this.blueTankImg) {
            ctx.drawImage(this.blueTankImg, this.position.x, this.position.y, this.size, this.size);
        }
        ctx.restore();
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