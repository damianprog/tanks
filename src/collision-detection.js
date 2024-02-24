export default (object1, object2, deltaTime) => {
    const object1SpeedX = object1.speedX ? object1.speedX * deltaTime : 0;
    const object1SpeedY = object1.speedY ? object1.speedY * deltaTime : 0;

    const object2SpeedX = object2.speedX ? object2.speedX * deltaTime : 0;
    const object2SpeedY = object2.speedY ? object2.speedY * deltaTime : 0;

    if (object1.position.x + object1SpeedX + object1.size >= object2.position.x + object2SpeedX
        && object1.position.x + object1SpeedX <= object2.position.x + object2SpeedX + object2.size
        && object1.position.y + object1SpeedY + object1.size >= object2.position.y + object2SpeedY
        && object1.position.y + object1SpeedY <= object2.position.y + object2SpeedY + object2.size) {
        return true;
    }
}