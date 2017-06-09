/**
 * @copyright   2016 Qronicle.be
 * @since       2016-12-06 22:27
 * @author      Ruud Seberechts
 */
class Plane extends AbstractDisplayObject {
    constructor(position, normal) {
        super();
        this.position = position;
        this.normal = normal;
        // Calculate tangent and bitangent
        if (normal.x != 0 || normal.z != 0) {
            this.tangent = this.normal.cross(Math2.VECTOR_UP);
        } else {
            this.tangent = new Vector3(1, 0, 0);
        }
        this.bitangent = this.normal.cross(this.tangent);
    }

    intersect(ray) {
        var denom = this.normal.dot(ray.direction);
        if (Math.abs(denom) > Math2.EPSILON) {
            var t = this.position.subtract(ray.origin).dot(this.normal) / denom;
            if (t >= 0) {
                return {
                    distance: t,
                    inside: false
                };
            }
        }
        return false;
    }

    applyMaterialNormalOffset(normal, u, v) {
        var offset = this.material.getNormalOffset(u, v);
        if (offset) {
            return offset.mapToTangentSpace(normal, this.tangent, this.bitangent);
        }
        return normal;
    }

    getSurfaceProperties(intersection) {
        var u = intersection.dot(this.tangent);
        var v = intersection.dot(this.bitangent);
        return {
            normal: this.applyMaterialNormalOffset(this.normal, u, v),
            u: u,
            v: v,
        };
    }

    getNormalAt(hit, scene) {
        return this.normal;
    }
}