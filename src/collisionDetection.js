export default (object1, object2) => {
    if (this.position.x + this.speedX * deltaTime + this.size >= block.position.x
        && this.position.x + this.speedX * deltaTime - this.size <= block.position.x + block.size
        && this.position.y + this.speedY * deltaTime + this.size >= block.position.y
        && this.position.y + this.speedY * deltaTime - this.size <= block.position.y + block.size) {
        return true;
    }
} 