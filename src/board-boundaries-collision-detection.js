export default (movingObject, deltaTime) => {
    if (movingObject.position.x + movingObject.size + movingObject.speedX * deltaTime > 600
        || movingObject.position.y + movingObject.size + movingObject.speedY * deltaTime > 600
        || movingObject.position.x + movingObject.speedX * deltaTime < 0
        || movingObject.position.y + movingObject.speedY * deltaTime < 0
    ) {
        return true;
    }
}