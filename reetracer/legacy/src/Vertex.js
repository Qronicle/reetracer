/**
 * @copyright   2016 Qronicle.be
 * @since       2016-12-03 18:30
 * @author      Ruud Seberechts
 */
class Vertex {
    constructor(position, normal = null, textureCoords = null) {
        this.position = position;
        this.normal = normal;
        this.textureCoords = textureCoords;
    }
}
