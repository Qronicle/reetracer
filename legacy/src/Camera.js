/**
 * This camera is a hoax and is always placed at (0, 0, 0), with direction (0, 0, 1)
 *
 * @copyright   2016 Qronicle.be
 * @since       2016-12-03 18:28
 * @author      Ruud Seberechts
 */
class Camera {
    constructor(position, frameWidth, frameHeight, originDist) {
        this.position = position;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.originDist = originDist;
        this.halfFrameWidth = frameWidth * .5;
        this.halfFrameHeight = frameHeight * .5;
    }

    getRay(x, y) {
        var origin = new Vector3(
            x * this.frameWidth - this.halfFrameWidth,
            -(y * this.frameHeight - this.halfFrameHeight),
            0
        );
        var direction = new Vector3(
            origin.x,
            origin.y,
            this.originDist
        );
        return new Ray(origin, direction);
    }
}
