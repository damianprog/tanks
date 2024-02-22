export default class BrickBlock {
    constructor(game, position) {
        this.game = game;
        this.position = position;
        this.size = 20;
    }

    update(deltaTime) {

    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = '#ba2f25';
        ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
    }

}