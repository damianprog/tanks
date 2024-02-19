import { MOVING_DIRECTION } from "./moving-direction.js";

export default class Missile {
    static size = 5;

    constructor(position, movingDirection) {
        this.position = position;
        this.movingDirection = movingDirection;
        this.setSpeed();
    }

    setSpeed() {
        switch (this.movingDirection) {
            case MOVING_DIRECTION.UP:
                this.speedX = 0;
                this.speedY = -0.1;
                break;
            case MOVING_DIRECTION.DOWN:
                this.speedX = 0;
                this.speedY = 0.1;
                break;
            case MOVING_DIRECTION.LEFT:
                this.speedX = -0.1;
                this.speedY = 0;
                break;
            case MOVING_DIRECTION.RIGHT:
                this.speedX = 0.1;
                this.speedY = 0;
                break;
        }
    }

    update(deltaTime) {
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