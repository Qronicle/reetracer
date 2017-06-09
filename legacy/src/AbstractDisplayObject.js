/**
 * @copyright   2016 Qronicle.be
 * @since       2016-12-03 18:29
 * @author      Ruud Seberechts
 */
class AbstractDisplayObject {
    constructor() {
        this.castShadows = true;
        this._material = new Material();
    }

    set material(material) {
        this._material = material;
    }

    get material() {
        return this._material;
    }

    intersect(ray) {

        return false;
    }

    getNormalAt(v) {
        return new Vector3();
    }

    applyMaterialNormalOffset(normal, u, v) {
        var offset = this.material.getNormalOffset(u, v);
        if (offset) {

        }
        return offset ? offset : normal;
    }
}
