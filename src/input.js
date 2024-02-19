export default class Input {
    constructor(game) {
        this.game = game;
        this.player = this.game.player;
        document.addEventListener("keydown", event => {
            switch (event.key) {
                case "ArrowLeft":
                    this.player.moveLeft();
                    break;

                case "ArrowRight":
                    this.player.moveRight();
                    break;

                case "ArrowDown":
                    this.player.moveDown();
                    break;

                case "ArrowUp":
                    this.player.moveUp();
                    break;

                case " ":
                    this.player.shoot();
                    break;
            }
        });

        document.addEventListener('keyup', (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                    this.player.stop();
                    break;

                case 'ArrowRight':
                    this.player.stop();
                    break;
                case 'ArrowUp':
                    this.player.stop();
                    break;

                case 'ArrowDown':
                    this.player.stop();
                    break;
            }
        });
    }

}
