/**
 * @copyright   2016 Qronicle.be
 * @since       2016-12-13 19:43
 * @author      Ruud Seberechts
 */
class Texture {
    constructor(imageData) {
        this.data = imageData.data;
        this.width = imageData.width;
        this.height = imageData.height;
        this.scale = 1;
        this.strength = 1;
        this.invertY = false;
        this.invertX = false;
        this.flipUV = false;
    }

    getColorAt(x, y) {
        /*x = x < 0 ? x + this.width : x > this.width ? x - this.width : x;
        y = y < 0 ? y + this.height : y > this.height ? y - this.height : y;*/
        var s = ((this.width * y) + x) * 4;
        return new Color(
            this.data[s] / 255,
            this.data[s + 1] / 255,
            this.data[s + 2] / 255
        );
    }
}