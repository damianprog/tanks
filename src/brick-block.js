import Block from "./block.js";

export default class BrickBlock extends Block {
    constructor(game, position, color) {
        super(game, position, '#ba2f25');
        this.loadBrickImage();
    }

    loadBrickImage() {
        this.brickImg = new Image();
        this.brickImg.src = "/assets/images/brick.png";
    }

    draw(ctx) {
        if (this.brickImg) {
            ctx.drawImage(this.brickImg, this.position.x, this.position.y, this.size, this.size);
        }
    }
}