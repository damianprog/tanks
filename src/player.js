import Position from './position.js'

export default class Player {
    constructor(game) {
        this.game = game;
        this.size = 30;
        this.position = new Position(300, 291);
        this.speedX = 0;
        this.speedY = 0;

        this.movingDirections = {
            up: 'up',
            down: 'down',
            left: 'left',
            right: 'right'
        };
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.position.x, this.position.y, this.size, this.size);
        ctx.fillStyle = "#00FF00";
        ctx.fill();
    }

    update(deltaTime) {
        this.position.x = this.position.x + this.speedX * deltaTime;
        this.position.y = this.position.y + this.speedY * deltaTime;
    }

    moveLeft() {
        this.speedY = 0;
        this.speedX = -0.1;
        this.currentMovingDirection = this.movingDirections.left;
    }

    moveRight() {
        this.speedY = 0;
        this.speedX = 0.1;
        this.currentMovingDirection = this.movingDirections.right;
    }

    moveUp() {
        this.speedX = 0;
        this.speedY = -0.1;
        this.currentMovingDirection = this.movingDirections.up;
    }

    moveDown() {
        this.speedX = 0;
        this.speedY = 0.1;
        this.currentMovingDirection = this.movingDirections.down;
    }

    stop() {
        this.speedX = 0;
        this.speedY = 0;
    }
}