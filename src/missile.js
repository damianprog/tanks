import { MOVING_DIRECTION } from "./moving-direction.js";

export default class Missile {
    static size = 5;

    constructor(position, movingDirection, isEnemy) {
        this.position = position;
        this.movingDirection = movingDirection;
        this.isEnemy = isEnemy;
        this.markedForDeletion = false;
        this.setSpeed();
    }

    setSpeed() {
        switch (this.movingDirection) {
            case MOVING_DIRECTION.UP:
                this.speedX = 0;
                this.speedY = -0.2;
                break;
            case MOVING_DIRECTION.DOWN:
                this.speedX = 0;
                this.speedY = 0.2;
                break;
            case MOVING_DIRECTION.LEFT:
                this.speedX = -0.2;
                this.speedY = 0;
                break;
            case MOVING_DIRECTION.RIGHT:
                this.speedX = 0.2;
                this.speedY = 0;
                break;
        }
    }

    update(deltaTime) {
        if (this.position.x > 600
            || this.position.y > 600
            || this.position.x < 0
            || this.position.y < 0
        ) {
            this.markedForDeletion = true;
        }

        this.position.x = this.position.x + this.speedX * deltaTime;
        this.position.y = this.position.y + this.speedY * deltaTime;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.position.x, this.position.y, Missile.size, Missile.size);
        ctx.fillStyle = "#FFF";
        ctx.fill();
    }
}