import Position from './position.js'
import { MOVING_DIRECTION } from './moving-direction.js'
import Missile from './missile.js';
import collisionDetection from './collision-detection.js';
import boardBoundariesCollisionDetection from './board-boundaries-collision-detection.js';

export default class Player {
    constructor(game) {
        this.game = game;
        this.size = 30;
        this.speedX = 0;
        this.speedY = 0;
        this.currentMovingDirection = MOVING_DIRECTION.UP;
        this.missiles = [];
        this.lives = 3;
        this.setStartingPosition();
        this.loadTankImage();
    }

    setStartingPosition() {
        this.position = new Position(285, 465);
    }

    loadTankImage() {
        this.tankImg = new Image();
        this.tankImg.src = "/assets/images/green-tank.png";
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

        if (this.tankImg) {
            ctx.drawImage(this.tankImg, this.position.x, this.position.y, this.size, this.size);
        }
        ctx.restore();
    }

    update(deltaTime) {
        let collisionDetected = false;

        if (boardBoundariesCollisionDetection(this, deltaTime)) {
            collisionDetected = true;
            this.stop();
        }

        this.game.allBlocks.forEach(block => {
            if (collisionDetection(this, block, deltaTime)) {
                collisionDetected = true;
                this.stop();
            }
        });

        if (!collisionDetected) {
            this.position.x = this.position.x + this.speedX * deltaTime;
            this.position.y = this.position.y + this.speedY * deltaTime;
        }
    }

    isLastShootTimePassed() {
        return this.lastShoot ? new Date() - this.lastShoot >= 500 : true;
    }

    shoot() {
        if (this.isLastShootTimePassed()) {
            const missilePosition = new Position(this.position.x + 15 - Missile.size / 2, this.position.y + 15 - Missile.size / 2);
            this.game.createMissile(missilePosition, this.currentMovingDirection);
            this.lastShoot = new Date();
        }
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