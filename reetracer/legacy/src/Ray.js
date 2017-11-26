/**
 * @copyright   2016 Qronicle.be
 * @since       2016-12-03 18:27
 * @author      Ruud Seberechts
 */
class Ray {
    constructor(origin, direction) {
        this.origin = origin;
        this.direction = direction.unit();
    }
}
