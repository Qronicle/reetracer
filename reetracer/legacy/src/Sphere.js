/**
 * @copyright   2016 Qronicle.be
 * @since       2016-12-03 18:30
 * @author      Ruud Seberechts
 */
class Sphere extends AbstractDisplayObject {
    constructor(center, radius) {
        super();
        this.center = center;
        this.radius = radius;
        this.radius2 = radius * radius;
    }

    intersect(ray) {
        var v = ray.origin.subtract(this.center);
        var b = -v.dot(ray.direction);
        var det = (b * b) - v.dot(v) + this.radius2;
        if (det > 0) {
            det = Math.sqrt(det);
            var i1 = b - det;
            var i2 = b + det;
            if (i2 > 0) {
                if (i1 < 0) {
                    //if (i2 < a_Dist) {
                    return {
                        distance: i2,
                        inside: true,
                    };
                    //}
                }
                else {
                    //if (i1 < a_Dist) {
                    return {
                        distance: i1,
                        inside: false,
                    };
                    //}
                }
            }
        }
        return false;
    }

    getSurfaceProperties(intersection) {
        var normal = intersection.subtract(this.center).unit();
        var u = Math.atan2(normal.z, normal.x) / Math2.PI2;
        var v = (-Math.asin(normal.y) / Math.PI) - 0.5;
        return {
            normal: this.applyMaterialNormalOffset(normal, u, v),
            u: u,
            v: v,
        };
    }

    applyMaterialNormalOffset(normal, u, v) {
        var offset = this.material.getNormalOffset(u, v);
        if (offset) {
            if (normal.x != 0 || normal.z != 0) {
                var tangent = normal.cross(Math2.VECTOR_UP).unit();
            } else {
                tangent = new Vector3(0, 0, 1);
            }
            var bitangent = normal.cross(tangent).unit();
            if (bitangent.y > 0) bitangent = bitangent.negative();
            //console.log(normal, tangent, bitangent);
            return offset.mapToTangentSpace(normal, tangent, bitangent);
        }
        return normal;
    }

    getNormalAt(intersection) {
        return intersection.subtract(this.center).unit();
    }
}
