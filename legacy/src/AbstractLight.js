/**
 * @copyright   2016 Qronicle.be
 * @since       2016-12-06 21:13
 * @author      Ruud Seberechts
 */
class AbstractLight {
    constructor(intensity = 1, color = new Color(1, 1, 1)) {
        this.intensity = intensity;
        this.color = color;
    }

    getIntensity(intersection, scene) {
        return this.intensity;
    }
}