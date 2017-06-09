var Math2 = {
    PI: Math.PI,
    PI2: Math.PI * 2,
    EPSILON: 0.000001
};
/**
 * @copyright   2016 Qronicle.be
 * @since       2016-12-03 18:26
 * @author      Ruud Seberechts
 */
class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    negative() {
        return new Vector3(-this.x, -this.y, -this.z);
    }

    add(v) {
        if (v instanceof Vector3) return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
        else return new Vector3(this.x + v, this.y + v, this.z + v);
    }

    subtract(v) {
        if (v instanceof Vector3) return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
        else return new Vector3(this.x - v, this.y - v, this.z - v);
    }

    multiply(v) {
        if (v instanceof Vector3) return new Vector3(this.x * v.x, this.y * v.y, this.z * v.z);
        else return new Vector3(this.x * v, this.y * v, this.z * v);
    }

    divide(v) {
        if (v instanceof Vector3) return new Vector3(this.x / v.x, this.y / v.y, this.z / v.z);
        else return new Vector3(this.x / v, this.y / v, this.z / v);
    }

    equals(v) {
        return this.x == v.x && this.y == v.y && this.z == v.z;
    }

    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    cross(v) {
        return new Vector3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }

    length() {
        return Math.sqrt(this.dot(this));
    }

    unit() {
        return this.divide(this.length());
    }

    min() {
        return Math.min(Math.min(this.x, this.y), this.z);
    }

    max() {
        return Math.max(Math.max(this.x, this.y), this.z);
    }

    distanceTo(v) {
        return Math.sqrt(this.squareDistanceTo(v));
    }

    squareDistanceTo(v) {
        return Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2) + Math.pow(this.z - v.z, 2);
    }

    toAngles() {
        return {
            theta: Math.atan2(this.z, this.x),
            phi: Math.asin(this.y / this.length())
        };
    }

    angleTo(a) {
        return Math.acos(this.dot(a) / (this.length() * a.length()));
    }

    toArray(n) {
        return [this.x, this.y, this.z].slice(0, n || 3);
    }

    clone() {
        return new Vector3(this.x, this.y, this.z);
    }

    init(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    randomize(factor = 0.1) {
        var factor2 = factor * 0.5;
        var vn = new Vector3(
            Math.random() * factor - factor2,
            Math.random() * factor - factor2,
            Math.random() * factor - factor2
        );
        return this.add(vn).unit();
    }

    mapToTangentSpace(normal, tangent, bitangent) {
        return new Vector3(
            this.x * tangent.x + this.y * bitangent.x + this.z * normal.x,
            this.x * tangent.y + this.y * bitangent.y + this.z * normal.y,
            this.x * tangent.z + this.y * bitangent.z + this.z * normal.z
        );
        return new Vector3(
            this.x * normal.x + this.x * tangent.x + this.x * bitangent.x,
            this.y * normal.y + this.y * tangent.y + this.y * bitangent.y,
            this.z * normal.z + this.z * tangent.z + this.z * bitangent.z
        );
    }

    rotate(rotation) {
        if (rotation.x) {
            this.init(
                this.x,
                this.y * Math.cos(rotation.x) - this.z * Math.sin(rotation.x),
                this.z * Math.cos(rotation.x) + this.y * Math.sin(rotation.x)
            );
        }
        if (rotation.y) {
            this.init(
                this.x * Math.cos(-rotation.y) - this.z * Math.sin(-rotation.y),
                this.y,
                this.x * Math.sin(-rotation.y) + this.z * Math.cos(-rotation.y)
            );
        }
        if (rotation.z) {
            this.init(
                this.x * Math.cos(rotation.z) - this.y * Math.sin(rotation.z),
                this.x * Math.sin(rotation.z) + this.y * Math.cos(rotation.z),
                this.z
            );
        }
    }
}

Math2.VECTOR_UP = new Vector3(0, 1, 0);
Math2.VECTOR_FORWARD = new Vector3(0, 0, 1);/**
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
/**
 * @copyright   2016 Qronicle.be
 * @since       2016-12-03 18:26
 * @author      Ruud Seberechts
 */
class Color {
    constructor(r = 0, g = 0, b = 0) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    add(c) {
        if (c instanceof Color) return new Color(this.r + c.r, this.g + c.g, this.b + c.b);
        else return new Color(this.r + c, this.g + c, this.b + c);
    }

    subtract(c) {
        if (c instanceof Color) return new Color(this.r - c.r, this.g - c.g, this.b - c.b);
        else return new Color(this.r - c, this.g - c, this.b - c);
    }

    multiply(c) {
        if (c instanceof Color) return new Color(this.r * c.r, this.g * c.g, this.b * c.b);
        else return new Color(this.r * c, this.g * c, this.b * c);
    }

    clone() {
        return new Color(this.r, this.g, this.b);
    }

    init(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
        return this;
    }

    initRgb(r, g, b) {
        this.r = r / 255;
        this.g = g / 255;
        this.b = b / 255;
        return this;
    }

    getR() {
        return Math.max(0, Math.min(255, Math.round(this.r * 255)));
    }

    getG() {
        return Math.max(0, Math.min(255, Math.round(this.g * 255)));
    }

    getB() {
        return Math.max(0, Math.min(255, Math.round(this.b * 255)));
    }
}/**
 * @copyright   2016 Qronicle.be
 * @since       2016-12-03 18:31
 * @author      Ruud Seberechts
 */
class Material {
    constructor(diffuse = new Color()) {
        this.diffuse = diffuse;
        this.reflection = 0;
        this.roughness = 0;
        this.specular = 0;
        this.refraction = 0;
        this.refractionIndex = 1;
        this.texture = null;
        this.bump = null; // Bump map
        this.normal = null; // Normal map
    }

    getDiffuseColor(surfaceProperties) {
        return this.getPropertyColor(this.diffuse, surfaceProperties);
    }

    getPropertyColor(texture, surfaceProperties) {
        if (texture instanceof Color) {
            return texture;
        }
        if (texture instanceof Texture) {
            var u = surfaceProperties.u * texture.scale;
            if (u < 0 || u > 1) u = u % 1;
            if (u < 0) u += 1;
            var v = surfaceProperties.v * texture.scale;
            if (v < 0 || v > 1) v = v % 1;
            if (v < 0) v += 1;
            if (texture.flipUV) {
                var tmp = v;
                v = u;
                u = tmp;
            }

            /*/ Nearest neighbour
            var x = Math.round(u * (texture.width-1));
            var y = Math.round(v * (texture.height-1));
            return texture.getColorAt(x, y); //*/

            // Bilinear filtering
            var x = u * (texture.width-1) + texture.width - 0.5;
            var y = v * (texture.height-1) + texture.height - 0.5;
            var x1 = Math.floor(x) % texture.width;
            var y1 = Math.floor(y) % texture.height;
            var x2 = (x1 + 1) % texture.width;
            var y2 = (y1 + 1) % texture.height;
            // calculate fractional parts of u and v
            var fracu = (x == 0 ? 1 : x) - Math.floor(x);
            var fracv = (y == 0 ? 1 : y) - Math.floor(y);
            // calculate weight factors
            var w1 = (1 - fracu) * (1 - fracv);
            var w2 = fracu * (1 - fracv);
            var w3 = (1 - fracu) * fracv;
            var w4 = fracu * fracv;
            // fetch four texels

            var c1 = texture.getColorAt(x1, y1);
            var c2 = texture.getColorAt(x2, y1);
            var c3 = texture.getColorAt(x1, y2);
            var c4 = texture.getColorAt(x2, y2);
            // scale and sum the four colors
            return c1.multiply(w1)
                .add(c2.multiply(w2))
                .add(c3.multiply(w3))
                .add(c4.multiply(w4));
        }
    }

    getNormalOffset(u, v) {
        if (this.bump instanceof Texture) {
            var c = this.getPropertyColor(this.bump, {u: u-0.01, v: v-0.01});
            var cx = this.getPropertyColor(this.bump, {u: u+0.01, v: v-0.01});
            var cy = this.getPropertyColor(this.bump, {u: u-0.01, v: v+0.01});
            // Calculate offsets
            var xOffset = c.r - cx.r;
            var yOffset = c.r - cy.r;
            var v3 = new Vector3(xOffset * this.bump.strength, yOffset * this.bump.strength, 1);
            return v3.unit();
        }
        if (this.normal instanceof Texture) {
            /*var n = new Vector3(Math.random() * 0.2, Math.random() * 0.2, 1);
            return n.unit();*/
            var c = this.getPropertyColor(this.normal, {u: u, v: v});
            var mX = this.normal.invertX ? -1 : 1;
            var mY = this.normal.invertY ? 1 : -1;
            if (this.normal.flipUV) {
                v = new Vector3(-mX * (c.g - 0.5), -mY * (c.r - 0.5), c.b - 0.5);
            } else {
                // default
                v = new Vector3(mX * (c.r - 0.5), mY * (c.g - 0.5), c.b - 0.5);
            }
            return v.unit();
        }
        /*/ Roughness
        if (object.material.roughness) {
            var d = object.material.roughness;
            var d2 = d * 0.5;
            var vn = new Vector3(
                Math.random() * d - d2,
                Math.random() * d - d2,
                Math.random() * d - d2
            );
            normal = normal.add(vn).unit();
        }//*/
        return false;
    }
}
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
}/**
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
}/**
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
class Triangle extends AbstractDisplayObject {
    constructor(v1, v2, v3, renderBackside = true, renderFlat = false) {
        super();
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
        this.renderBackside = renderBackside;
        this.renderFlat = renderFlat;
        // Calculate normal
        var u = v2.position.subtract(v1.position);
        var v = v3.position.subtract(v1.position);
        this.normal = new Vector3(
            (u.y * v.z) - (u.z * v.y),
            (u.z * v.x) - (u.x * v.z),
            (u.x * v.y) - (u.y * v.x)
        ).unit();
        if (!v1.normal) v1.normal = this.normal;
        if (!v2.normal) v2.normal = this.normal;
        if (!v3.normal) v3.normal = this.normal;
        this.e1 = u;
        this.e2 = v;
        // Calculate tangent and bitangent
        if (this.normal.x != 0 || this.normal.z != 0) {
            this.tangent = this.normal.cross(Math2.VECTOR_UP);
        } else {
            this.tangent = new Vector3(1, 0, 0);
        }
        this.bitangent = this.normal.cross(this.tangent);
    }

    get vertices() {return [this.v1, this.v2, this.v3];}

    intersect(ray) {
        var h = ray.direction.cross(this.e2);
        var a = this.e1.dot(h);
        if (a == 0) return false;
        if (!this.renderBackside && a < 0) return false;
        var f = 1 / a;
        var s = ray.origin.subtract(this.v1.position);
        var u = f * s.dot(h);
        if (u < 0 || u > 1) return false;
        var q = s.cross(this.e1);
        var v = f * ray.direction.dot(q);
        if (v < 0 || u + v > 1) return false;
        var t = f * this.e2.dot(q);
        if (t >= 0) {
            return {
                distance: t,
                u: u,
                v: v,
                inside: false
            };
        }
        return false;
    }

    getSurfaceProperties(intersection, hit) {
        var normal = this.getNormalAt(intersection, hit);
        var u = hit.u;
        var v = hit.v;
        if (this.v1.textureCoords) {
            var textureX = (1 - u - v) * this.v1.textureCoords.x + u * this.v2.textureCoords.x + v * this.v3.textureCoords.x;
            var textureY = (1 - u - v) * this.v1.textureCoords.y + u * this.v2.textureCoords.y + v * this.v3.textureCoords.y;
            u = textureX;
            v = 1 - textureY;
        }
        return {
            normal: this.applyMaterialNormalOffset(normal, u, v),
            u: u,
            v: v,
        };
    }

    applyMaterialNormalOffset(normal, u, v) {
        var offset = this.material.getNormalOffset(u, v);
        if (offset) {
            var n = offset.mapToTangentSpace(this.normal, this.tangent, this.bitangent);
            return n;
        }
        return normal;
    }

    getNormalAt(intersection, traceResult) {
        if (this.renderFlat) {
            return this.normal;
        }
        return this.v1.normal.multiply(1 - traceResult.u - traceResult.v)
            .add(this.v2.normal.multiply(traceResult.u))
            .add(this.v3.normal.multiply(traceResult.v));
    }
}
/**
 * @copyright   2016 Qronicle.be
 * @since       2016-12-29 21:18
 * @author      Ruud Seberechts
 */
class Polygon extends AbstractDisplayObject {
    constructor(vertices, renderBackside = false, renderFlat = false) {
        super();
        this.vertices = vertices;
        //this.minVector = new Vector3(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
        //this.maxVector = new Vector3(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);
        this.triangles = [];
        for (var vi = 2; vi < vertices.length; vi++) {
            //console.log(vertices[0], vertices[vi-1], vertices[vi]);
            this.triangles.push(new Triangle(
                vertices[0],
                vertices[vi - 1],
                vertices[vi],
                renderBackside,
                renderFlat
            ));
        }
        // Calculate center
        var minVector = new Vector3(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
        var maxVector = new Vector3(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);
        for (var v in this.vertices) {
            var vertex = this.vertices[v].position;
            minVector.x = Math.min(minVector.x, vertex.x);
            minVector.y = Math.min(minVector.y, vertex.y);
            minVector.z = Math.min(minVector.z, vertex.z);
            maxVector.x = Math.max(maxVector.x, vertex.x);
            maxVector.y = Math.max(maxVector.y, vertex.y);
            maxVector.z = Math.max(maxVector.z, vertex.z);
        }
        var sphereCenter = minVector.add(maxVector).multiply(0.5);
        // Calculate radius
        var sphereRadius = 0;
        for (v in this.vertices) {
            vertex = this.vertices[v].position;
            var dist = vertex.squareDistanceTo(sphereCenter);
            if (dist > sphereRadius) sphereRadius = dist;
        }
        this.boundingSphere = new Sphere(sphereCenter, Math.sqrt(sphereRadius));
    }

    intersect(ray) {
        if (!this.boundingSphere.intersect(ray)) return false;
        for (var i in this.triangles) {
            var triangle = this.triangles[i];
            var intersection = triangle.intersect(ray);
            if (intersection) {
                intersection.triangle = triangle;
                return intersection;
            }
        }
        return false;
    }

    set material(material) {
        super.material = material;
        for (var t in this.triangles) {
            this.triangles[t].material = material;
        }
    }

    get material() {return super.material;}

    getNormalAt(intersection, traceResult) {
        return traceResult.triangle.getNormalAt(intersection, traceResult);
    }

    getSurfaceProperties(intersection, hit) {
        return hit.triangle.getSurfaceProperties(intersection, hit);
    }

    applyMaterialNormalOffset(normal, u, v) {
        return null;
    }

    getNormalAt(intersection, traceResult) {
        return null;
    }
}
/**
 * @copyright   2016 Qronicle.be
 * @since       2016-12-29 21:56
 * @author      Ruud Seberechts
 */
class Mesh extends AbstractDisplayObject {
    constructor(polygons, boundingLevels) {
        super();
        this.polygons = polygons;
        this.debug = false;
        // Calculate center
        var minVector = new Vector3(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
        var maxVector = new Vector3(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);
        for (var p in polygons) {
            for (var v in polygons[p].vertices) {
                var vertex = polygons[p].vertices[v].position;
                minVector.x = Math.min(minVector.x, vertex.x);
                minVector.y = Math.min(minVector.y, vertex.y);
                minVector.z = Math.min(minVector.z, vertex.z);
                maxVector.x = Math.max(maxVector.x, vertex.x);
                maxVector.y = Math.max(maxVector.y, vertex.y);
                maxVector.z = Math.max(maxVector.z, vertex.z);
            }
        }
        var sphereCenter = minVector.add(maxVector).multiply(0.5);
        // Calculate radius
        var sphereRadius = 0;
        for (p in polygons) {
            for (v in polygons[p].vertices) {
                vertex = polygons[p].vertices[v].position;
                var dist = vertex.squareDistanceTo(sphereCenter);
                if (dist > sphereRadius) sphereRadius = dist;
            }
        }
        this.boundingSphere = new Sphere(sphereCenter, Math.sqrt(sphereRadius));
        this.boundingLevels = [];
        for (var bl in boundingLevels) {
            var subs = [];
            var subLength = boundingLevels[bl];
            var subCubes = [];
            var numX = Math.floor((maxVector.x - minVector.x) / subLength) + 1;
            var numY = Math.floor((maxVector.y - minVector.y) / subLength) + 1;
            var numZ = Math.floor((maxVector.z - minVector.z) / subLength) + 1;
            for (x = 0; x < numX; x++) {
                subs[x] = [];
                for (y = 0; y < numX; y++) {
                    subs[x][y] = [];
                    for (z = 0; z < numX; z++) {
                        subs[x][y][z] = 0;
                    }
                }
            }
            for (p in polygons) {
                for (v in polygons[p].vertices) {
                    vertex = polygons[p].vertices[v].position;
                    var x = Math.floor((vertex.x - minVector.x) / subLength);
                    var y = Math.floor((vertex.y - minVector.y) / subLength);
                    var z = Math.floor((vertex.z - minVector.z) / subLength);
                    if (!subs[x][y][z]) {
                        subs[x][y][z] = [p];
                    } else {
                        subs[x][y][z].push(p);
                    }
                }
            }
            for (x = 0; x < numX; x++) {
                for (y = 0; y < numX; y++) {
                    for (z = 0; z < numX; z++) {
                        if (!subs[x][y][z]) continue;
                        var x0 = minVector.x + x * subLength;
                        var y0 = minVector.y + y * subLength;
                        var z0 = minVector.z + z * subLength;
                        var x1 = x0 + subLength;
                        var y1 = y0 + subLength;
                        var z1 = z0 + subLength;
                        var v1 = new Vertex(new Vector3(x0, y1, z0));
                        var v2 = new Vertex(new Vector3(x1, y1, z0));
                        var v3 = new Vertex(new Vector3(x1, y0, z0));
                        var v4 = new Vertex(new Vector3(x0, y0, z0));
                        var v5 = new Vertex(new Vector3(x0, y1, z1));
                        var v6 = new Vertex(new Vector3(x1, y1, z1));
                        var v7 = new Vertex(new Vector3(x1, y0, z1));
                        var v8 = new Vertex(new Vector3(x0, y0, z1));
                        // Front plane
                        if (!this.debug || (z == 0 || subs[x][y][z-1] == 0)) {
                            subCubes.push(new Triangle(v1, v2, v3, false, true));
                            subCubes.push(new Triangle(v1, v3, v4, false, true));
                        }
                        // Back plane
                        if (!this.debug || (z+1 == numZ || subs[x][y][z+1] == 0)) {
                            subCubes.push(new Triangle(v6, v5, v7, false, true));
                            subCubes.push(new Triangle(v6, v8, v7, false, true));
                        }
                        // Left plane
                        if (!this.debug || (x == 0 || subs[x-1][y][z] == 0)) {
                            subCubes.push(new Triangle(v5, v1, v8, false, true));
                            subCubes.push(new Triangle(v8, v1, v4, false, true));
                        }
                        // Right plane
                        if (!this.debug || (x+1 == numX || subs[x+1][y][z] == 0)) {
                            subCubes.push(new Triangle(v2, v6, v7, false, true));
                            subCubes.push(new Triangle(v2, v7, v3, false, true));
                        }
                        // Bottom plane
                        if (!this.debug || (y == 0 || subs[x][y-1][z] == 0)) {
                            subCubes.push(new Triangle(v4, v3, v8, false, true));
                            subCubes.push(new Triangle(v8, v3, v7, false, true));
                        }
                        // Top plane
                        if (!this.debug || (y+1 == numY || subs[x][y+1][z] == 0)) {
                            subCubes.push(new Triangle(v5, v6, v1, false, true));
                            subCubes.push(new Triangle(v6, v2, v1, false, true));
                        }
                        if (!this.debug) {
                            var l = subCubes.length;
                            for (var b = -12; b < 0; b++) {
                                subCubes[l+b].polygons = subs[x][y][z];
                            }
                        }
                    }
                }
            }
            this.boundingLevels.push(subCubes);
        }
    }

    set material(material) {
        super.material = material;
        for (var p in this.polygons) {
            this.polygons[p].material = material;
        }
    }

    get material() {return super.material;}

    intersect(ray) {
        /*/ Check we intersect with the bounding sphere
        result = this.boundingSphere.intersect(ray);
        if (result) {
            result.polygon = this.boundingSphere;
            return result;
        }
        //*/
        if (!this.boundingSphere.intersect(ray)) return false;
        /*if (!this.boundingLevels) {
            var minDist = null;
            var result = false;
            for (var i in this.polygons) {
                var polygon = this.polygons[i];
                var intersection = polygon.intersect(ray);
                if (intersection && (minDist === null || intersection.distance < minDist)) {
                    intersection.polygon = polygon;
                    minDist = intersection.distance;
                    result = intersection;
                }
            }
            return result;
        }*/
        var boundCubes = [];
        for (var bl in this.boundingLevels) {
            for (var c in this.boundingLevels[bl]) {
                var s = this.boundingLevels[bl][c];
                var r = s.intersect(ray);
                if (!r) continue;
                boundCubes.push({
                    distance: r.distance,
                    cube: s,
                    r: r
                });
            }
        }
        if (!boundCubes.length) return false;
        // Order boundCubes from close to far
        for (var i = 0; i < boundCubes.length - 1; i++) {
            var changed = false;
            for (var j = 0; j < boundCubes.length - 1; j++) {
                if (boundCubes[j].distance > boundCubes[j+1].distance) {
                    changed = true;
                    var tmp = boundCubes[j];
                    boundCubes[j] = boundCubes[j+1];
                    boundCubes[j+1] = tmp;
                }
            }
            if (!changed) break;
        }
        if (this.debug) {
            boundCubes[0].r.polygon = boundCubes[0].cube;
            return boundCubes[0].r;
        }
        // List all polygons
        var usedPolygonIndexes = {};
        var result = false;
        for (var b in boundCubes) {
            var minDist = null;
            for (i in boundCubes[b].cube.polygons) {
                var polygonIndex = boundCubes[b].cube.polygons[i];
                if (usedPolygonIndexes[polygonIndex]) continue;
                usedPolygonIndexes[polygonIndex] = 1;
                var polygon = this.polygons[polygonIndex];
                var intersection = polygon.intersect(ray);
                if (intersection && (minDist === null || intersection.distance < minDist)) {
                    intersection.polygon = polygon;
                    minDist = intersection.distance;
                    result = intersection;
                }
            }
            if (result) {
                return result;
            }
        }
        return false;
    }

    getSurfaceProperties(intersection, hit) {
        //return this.boundingSphere.getSurfaceProperties(intersection, hit);
        return hit.polygon.getSurfaceProperties(intersection, hit);
    }
}
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
}/**
 * @copyright   2016 Qronicle.be
 * @since       2016-12-06 21:15
 * @author      Ruud Seberechts
 */
class AmbientLight extends AbstractLight {

}/**
 * @copyright   2016 Qronicle.be
 * @since       2016-12-06 21:36
 * @author      Ruud Seberechts
 */
class PointLight extends AbstractLight {
    constructor(position = new Vector3(), intensity = 1, innerRadius = 0, outerRadius = -1, color = new Color(1, 1, 1)) {
        super(intensity, color);
        this.position = position;
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.radiusDiff = this.outerRadius - this.innerRadius;
    }

    getIntensity(hit, scene) {
        var shade = 0;
        // Lighting
        var direction = this.position.subtract(hit.intersection).unit();

        var dot = hit.normal.dot(direction);
        if (dot > 0) {
            var intensity = this.intensity;
            if (this.outerRadius >= 0) {
                var distToLight = hit.intersection.distanceTo(this.position);
                if (distToLight >= this.outerRadius) {
                    intensity = 0;
                } else if (distToLight > this.innerRadius) {
                    intensity = (1 - ((distToLight - this.innerRadius) / this.radiusDiff)) * intensity;
                }
            }
            dot *= intensity;
        }
        if (dot <= 0) return 0;

        var nDirection = direction.clone();
        for (var j = 0; j < scene.numLightRays; j++) {
            var shadowRay = new Ray(hit.intersection.add(nDirection.multiply(0.0000001)), nDirection);
            var shadowResult = scene.miniTrace(shadowRay);
            if (shadowResult.displayObject && shadowResult.distance > 0 && Math.pow(shadowResult.distance, 2) < hit.intersection.squareDistanceTo(this.position)) {
                //shades.push(0);
                if (shadowResult.inside) {
                    shade += 1;
                }
            } else {
                shade += 1;
            }
            nDirection = direction.randomize(0.01);
        }
        shade = shade / scene.numLightRays;
        return dot * shade;
    }
}/**
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
class Scene {
    constructor(renderSettings) {
        this.renderSettings = renderSettings;
        this.ambientColor = new Color(0.3, 0.3, 1);
        this.maxRayDepth = 4;
        this.objects = [];
        this.lights = [];
        this.numLightRays = this.renderSettings.softShadows || 1;
        /*this.lights = [
            new PointLight(new Vector3(3, 20, -8), 1),
            //new PointLight(new Vector3(0, 4, 0))
        ];*/
        this.camera = new Camera(new Vector3(), 4, 3, 4);
    }

    miniTrace(ray) {
        var closest = false;
        var distance = null;
        var insideDisplayObject = null;
        var finalTraceResult = null;
        for (var i in this.objects) {
            var object = this.objects[i];
            var traceResult = object.intersect(ray);
            if (traceResult !== false && traceResult.distance > 0.00001) {
                if (!closest || traceResult.distance < distance) {
                    closest = object;
                    distance = traceResult.distance;
                    insideDisplayObject = traceResult.inside;
                    finalTraceResult = traceResult;
                }
            }
        }
        if (!closest) {
            return {
                displayObject: null,
                distance: distance,
                color: this.ambientColor
            };
        }
        finalTraceResult.displayObject = closest;
        return finalTraceResult;
    }

    rayTrace(ray, refractionIndex = 1, depth = 0) {
        // Find closest object
        var hit = this.miniTrace(ray);
        if (!hit.displayObject) return hit;
        var object = hit.displayObject;
        // Calculation point of intersection and normal
        hit.intersection = ray.origin.add(ray.direction.multiply(hit.distance));
        hit.surfaceProperties = object.getSurfaceProperties(hit.intersection, hit);
        hit.normal = hit.surfaceProperties.normal;
        // Reflection ray
        var reflectionDirection = new Vector3();
        if (object.material.reflection > 0 || object.material.specular > 0) {
            reflectionDirection = ray.direction.subtract(hit.normal.multiply(ray.direction.dot(hit.normal) * 2));
        }//*/
        // Calculate object color
        var color = new Color();
        // Scene lights
        for (var i in this.lights) {
            // Lighting
            var light = this.lights[i]; //p
            var intensity = light.getIntensity(hit, this);
            // calculate diffuse shading
            if (object.material.diffuse) {
                color = color.add(light.color.multiply(object.material.getDiffuseColor(hit.surfaceProperties)).multiply(intensity));
            }//*/
            // determine specular component
            if (object.material.specular > 0 && light instanceof PointLight) {
                // point light source: sample once for specular highlight
                var direction = light.position.subtract(hit.intersection).unit();
                var dot = direction.dot(reflectionDirection);
                if (dot > 0) {
                    var spec = Math.pow(dot, 20) * object.material.specular * intensity;
                    // add specular component to ray color
                    color = color.add(light.color.multiply(spec)); //light.color.multiply(object.material.color).multiply(diff));
                }
            }//*/
        }
        /*/ Ambient Occlusion
        if (this.renderSettings.ambientOcclusion) {
            var ambientShade = 0;
            var ambDist = 5;
            for (j = 0; j < this.renderSettings.ambientOcclusion; j++) {
                var ambientDir = normal.randomize(1);
                var ambientRay = new Ray(intersection.add(ambientDir.multiply(0.0000001)), ambientDir);
                var ambientResult = this.miniTrace(ambientRay);
                if (ambientResult.displayObject && ambientResult.distance > 0) {
                    if (ambientResult.distance <= ambDist) {
                        ambientShade += (ambDist - ambientResult.distance) / ambDist;
                    }
                }
            }
            ambientShade = ambientShade / this.renderSettings.ambientOcclusion;
            shade = (1 - ambientShade) * 0.8;
            color = color.multiply(0.5 + shade * 0.5);
        }//*/
        // Reflection
        if (object.material.reflection > 0 && depth < this.maxRayDepth) {
            var reflectionRay = new Ray(hit.intersection.add(reflectionDirection.multiply(Math2.EPSILON)), reflectionDirection);
            var reflectionResult = this.rayTrace(reflectionRay, refractionIndex, depth + 1);
            var reflectionColor = reflectionResult.color;
            color = color.multiply(1 - object.material.reflection).add(reflectionColor.multiply(object.material.reflection));
            //color = color.add(object.material.color.multiply(reflectionColor.multiply(object.material.reflection)));
        }//*/
        /*/ Refraction
         if (object.material.refraction > 0 && depth < this.maxRayDepth) {
         var n = refractionIndex / object.material.refractionIndex;
         var refractionNormal = normal;
         if (insideDisplayObject) {
         refractionNormal = refractionNormal.negative();
         }
         var cosI = -refractionNormal.dot(ray.direction);
         var cosT2 = 1 - n * n * (1 - cosI * cosI);
         if (cosT2 > 0) {
         var t = ray.direction.multiply(n).add(refractionNormal.multiply(n * cosI - Math.sqrt(cosT2)));
         var refractionRay = new Ray(intersection.add(t.multiply(0.0000001)), t);
         var refractionResult = this.rayTrace(refractionRay, object.material.refractionIndex, depth + 1);
         // apply Beer's law
         var refractionHitDistance = refractionResult ? refractionResult.distance : 1000000;
         var absorbance = object.material.color.multiply(0.15 * -refractionHitDistance);
         var transparency = new Color(Math.exp(absorbance.r), Math.exp(absorbance.g), Math.exp(absorbance.b));
         color = color.add(refractionResult.color.multiply(transparency));
         //
         }
         }//*/
        /*/ Dust
         if (Math.random() > 0.2 && depth == 0 && distance > 0 && distance < 20) {
         var dustPositions = [];
         for (i = 0; i < Math.ceil(distance); i++) {
         var dd = Math.random() + i;
         if (dd < distance) {
         dustPositions.push(ray.origin.add(ray.direction.multiply(dd)));
         }
         }
         if (dustPositions.length) {
         shade = 0;
         var m = 1 / this.lights.length;
         for (var dp in dustPositions) {
         for (i in this.lights) {
         // Lighting
         light = this.lights[i]; //p
         direction = light.position.subtract(dustPositions[dp]).unit();
         shadowRay = new Ray(dustPositions[dp], direction);
         shadowResult = this.miniTrace(shadowRay);
         if (shadowResult.displayObject && shadowResult.distance > 0 && Math.pow(shadowResult.distance, 2) < dustPositions[dp].squareDistanceTo(light.position)) {
         //shade += 0.5 * m;
         } else {
         shade += m;
         }
         }
         }
         shade /= dustPositions.length;
         color = color.multiply(shade);
         }
         }//*/
        return {
            displayObject: object,
            distance: hit.distance,
            color: color
        };
    }
}
/**
 * @copyright   2016 Qronicle.be
 * @since       2016-12-29 21:16
 * @author      Ruud Seberechts
 */
class ObjImporter {
    constructor(filename, scale = 0.1, translation = new Vector3(), rotation = new Vector3(), renderBackside = false, renderFlat = false, invertNormals = false) {
        this.scale = scale;
        this.translation = translation;
        this.rotation = rotation;
        this.polygons = [];
        this.vertices = [null];
        this.normals = [null];
        this.vertexCoords = [null];
        this.renderBackside = renderBackside;
        this.renderFlat = renderFlat;
        this.invertNormals = invertNormals;
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", filename, false);
        var self = this;
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status == 0) {
                    var allText = rawFile.responseText;
                    self.parseObj(allText);
                }
            }
        };
        rawFile.send(null);
    }

    parseObj(content) {
        var lines = content.split('\n');
        console.log(lines);
        for (var l in lines) {
            var line = lines[l];
            if (line.substr(0, 1) == '#') continue;
            var parts = line.replace(/\s\s+/g, ' ').trim().split(' ');
            if (!parts.length) continue;
            switch (parts[0]) {
                case 'v':
                    var vertex = new Vector3(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
                    // Apply rotation
                    if (this.rotation) {
                        vertex.rotate(this.rotation);
                    }
                    // Apply scale and offset
                    vertex = vertex.multiply(this.scale).add(this.translation);
                    this.vertices.push(vertex);
                    break;
                case 'vt':
                    this.vertexCoords.push({x: parseFloat(parts[1]), y: parseFloat(parts[2])});
                    break;
                case 'vn':
                    var normal = new Vector3(
                        parseFloat(parts[1]),
                        parseFloat(parts[2]),
                        parseFloat(parts[3])
                    );
                    // Apply rotation
                    if (this.rotation) {
                        normal.rotate(this.rotation);
                    }
                    normal = normal.unit();
                    //if (this.invertNormals) normal = normal.negative();
                    this.normals.push(normal);
                    break;
                case 'f':
                    var v = [];
                    var hasNormalInfo = false;
                    for (var p = 1; p < parts.length; p++) {
                        var faceData = parts[p].split('/');
                        var vIndex = parseInt(faceData[0]);
                        var nIndex = faceData[2] ? parseInt(faceData[2]) : false;
                        var tIndex = faceData[1] ? parseInt(faceData[1]) : false;
                        if (vIndex < 0) vIndex = this.vertices.length + vIndex;
                        if (nIndex < 0) nIndex = this.normals.length + nIndex;
                        if (tIndex < 0) tIndex = this.vertexCoords.length + tIndex;
                        v.push(new Vertex(
                            this.vertices[vIndex],
                            nIndex ? this.normals[nIndex] : null,
                            tIndex ? this.vertexCoords[tIndex] : null
                        ));
                    }
                    /*/ Polygon vs Triangle switcher
                    this.polygons.push(new Polygon(v, this.renderBackside, this.renderFlat));
                    /*/
                    for (var vi = 2; vi < v.length; vi++) {
                        this.polygons.push(new Triangle(v[0], v[this.invertNormals ? vi - 1 : vi], v[this.invertNormals ? vi : vi - 1], this.renderBackside, this.renderFlat));
                    }
                    //*/
                    break;
            }
        }
        console.log('Poly count:', this.polygons.length);
    }
}/**
 * @copyright   2016 Qronicle.be
 * @since       2016-12-03 18:18
 * @author      Ruud Seberechts
 */
class SceneImporter {
    constructor(renderer, finishCallback) {
        this.renderer = renderer;
        this.sceneDescription = renderer.settings.scene;
        this.onFinished = finishCallback;
        this.errors = [];
        this.textures = [];
        this.meshes = [];
        this.status = 'Importing scene';
        this.scene = new Scene(renderer.settings.output);
        this.textures = [];
        this.textureMap = [];
        this.texturesLoaded = 0;
        this.loadDependencies();
    }

    loadDependencies() {
        // Load textures and all that jazz
        var textureProperties = ['diffuse', 'bump', 'normal'];
        for (var i in this.sceneDescription.objects) {
            var material = this.sceneDescription.objects[i].material;
            for (var j in textureProperties) {
                var prop = textureProperties[j];
                if (material[prop] && material[prop].src) {
                    if (this.getTextureIndex(material[prop].src) === false) {
                        this.textureMap.push(material[prop]);
                    }
                }
            }
        }
        var cont = true;
        for (i in this.textureMap) {
            this.loadTexture(this.textureMap[i].src, i);
            cont = false;
        }
        if (cont) {
            this.tryAndContinue();
        }
    }

    loadTexture(src, index) {
        console.log('Started loading texture ' + index + ': ' + src);
        this.renderer.loadTexture(src);
    }

    textureLoaded(src, textureData) {
        var index = this.getTextureIndex(src);
        console.log('Finished loading texture ' + index + ': ' + src);
        /*var texture = new Texture(textureData);
         textureData = this.textureMap[index];
         texture.scale = textureData.scale || 1;*/
        this.textures[index] = textureData;
        this.texturesLoaded++;
        this.tryAndContinue();
    }

    tryAndContinue() {
        if (this.texturesLoaded == this.textureMap.length) {
            console.log('Finished loading textures');
            this.importLights();
            this.importObjects();
        }
    }

    getTextureIndex(src) {
        for (var i in this.textureMap) {
            if (this.textureMap[i].src == src) return i;
        }
        return false;
    }

    importLights() {
        if (this.sceneDescription.lights.length) {
            for (var i in this.sceneDescription.lights) {
                var l = this.sceneDescription.lights[i];
                var light = null;
                if (l.color) {
                    l.color = new Color(l.color[0] / 255, l.color[1] / 255, l.color[2] / 255);
                } else {
                    l.color = new Color(1, 1, 1);
                }
                switch (l.type) {
                    case 'ambient':
                        light = new AmbientLight(
                            l.intensity || 0,
                            l.color
                        );
                        break;
                    case 'point':
                        light = new PointLight(
                            new Vector3(l.position[0], l.position[1], l.position[2]),
                            l.intensity || 1,
                            l.innerRadius || -1,
                            l.outerRadius || -1,
                            l.color
                        );
                }
                if (light) {
                    this.scene.lights.push(light);
                }
            }
        }
    }

    importObjects() {
        if (this.sceneDescription.objects.length) {
            for (var i in this.sceneDescription.objects) {
                var o = this.sceneDescription.objects[i];
                var object = null;
                switch (o.type) {
                    case 'sphere':
                        object = new Sphere(
                            new Vector3(o.center[0], o.center[1], o.center[2]),
                            o.radius
                        );
                        break;
                    case 'plane':
                        object = new Plane(
                            new Vector3(o.position[0], o.position[1], o.position[2]),
                            new Vector3(o.normal[0], o.normal[1], o.normal[2])
                        );
                        if (o.tangent) {
                            object.tangent = new Vector3(o.tangent[0], o.tangent[1], o.tangent[2]);
                            object.bitangent = new Vector3(o.bitangent[0], o.bitangent[1], o.bitangent[2]);
                        }
                        break;
                    case 'triangle':
                        var v1 = new Vertex(new Vector3(o.points[0][0], o.points[0][1], o.points[0][2]));
                        var v2 = new Vertex(new Vector3(o.points[1][0], o.points[1][1], o.points[1][2]));
                        var v3 = new Vertex(new Vector3(o.points[2][0], o.points[2][1], o.points[2][2]));
                        if (o.textureCoords) {
                            v1.textureCoords = {x: o.textureCoords[0][0], y: o.textureCoords[0][1]};
                            v2.textureCoords = {x: o.textureCoords[1][0], y: o.textureCoords[1][1]};
                            v3.textureCoords = {x: o.textureCoords[2][0], y: o.textureCoords[2][1]};
                        }
                        object = new Triangle(v1, v2, v3);
                        break;
                    case 'polygon':
                        var vertices = [];
                        for (var vi in o.points) {
                            var vertex = new Vertex(new Vector3(o.points[vi][0], o.points[vi][1], o.points[vi][2]));
                            if (o.normals) {
                                vertex.normal = new Vector3(o.normals[vi][0], o.normals[vi][1], o.normals[vi][2]).unit()
                            }
                            if (o.textureCoords) {
                                vertex.textureCoords = {x: o.textureCoords[vi][0], y: o.textureCoords[vi][1]};
                            }
                            vertices.push(vertex);
                        }
                        object = new Polygon(
                            vertices,
                            o.renderBackside || false,
                            o.renderFlat || false
                        );
                        break;
                    case 'obj':
                        var objImporter = new ObjImporter(
                            o.file,
                            o.scale || 1,
                            o.offset ? new Vector3(o.offset[0], o.offset[1], o.offset[2]) : new Vector3(),
                            o.rotate ? new Vector3(o.rotate[0], o.rotate[1], o.rotate[2]) : new Vector3(),
                            o.renderBackside || false,
                            o.renderFlat || false,
                            o.invertNormals || false
                        );
                        object = new Mesh(objImporter.polygons, o.boundingLevels || []);
                        break;
                }
                if (object) {
                    object.material = new Material(this.getColorSpec(o.material.diffuse));
                    var defaultProps = {
                        reflection: 0,
                        roughness: 0,
                        specular: 0,
                        refraction: 0,
                        refractionIndex: 0,
                        bump: null,
                        normal: null,
                    }
                    for (var prop in defaultProps) {
                        var defaultValue = defaultProps[prop];
                        if (defaultValue === null) {
                            object.material[prop] = this.getColorSpec(o.material[prop]) || defaultValue;
                        } else {
                            object.material[prop] = o.material[prop] || defaultValue;
                        }
                    }
                    this.scene.objects.push(object);
                }
            }
        }
        this.status = 'Done importing';
        this.onFinished(this.scene);
    }

    getColorSpec(value) {
        if (!value) return null;
        if (value.src) {
            var textureData = this.textures[this.getTextureIndex(value.src)];
            var texture = new Texture(textureData);
            var defaultProps = {
                scale: 1,
                strength: 1,
                invertX: false,
                invertY: false,
                flipUV: false
            }
            for (var prop in defaultProps) {
                texture[prop] = typeof value[prop] != 'undefined' ? value[prop] : defaultProps[prop];
            }
            return texture;
        }
        return new Color(value[0] / 255, value[1] / 255, value[2] / 255)
    }
}/**
 * @copyright   2016 Qronicle.be
 * @since       2016-12-03 18:37
 * @author      Ruud Seberechts
 */
class ReeTracer {
    constructor(canvasId, sceneDescription, renderSettings = {}) {
        var canvas = document.getElementById(canvasId);
        renderSettings.width = renderSettings.width || 640;
        renderSettings.height = renderSettings.height || 480;
        canvas.width = renderSettings.width;
        canvas.height = renderSettings.height;

        this.bitmap = document.getElementById(canvasId).getContext('2d');
        this.imageData = this.bitmap.getImageData(0, 0, renderSettings.width, renderSettings.height);
        this.sceneDescription = sceneDescription;
        this.renderSettings = renderSettings;
    }

    render(callback) {
        var worker = new Worker('bin/reetracer.worker.js');
        var self = this;

        worker.postMessage({
            type: 'init',
            output: this.renderSettings,
            scene: this.sceneDescription,
        });
        worker.addEventListener('message', function (e) {
            switch (e.data.type) {
                case 'loadTexture':
                    self.loadTexture(e.data.src, function(texture){
                        worker.postMessage({
                            type: 'textureLoaded',
                            src: e.data.src,
                            texture: texture,
                        });
                    });
                    break;
                case 'addOutput':
                    var data = e.data;
                    var l = data.data.length;
                    for (var i = 0; i < l; i++) {
                        self.imageData.data[data.startIndex + i] = data.data[i];
                    }
                    self.bitmap.putImageData(self.imageData, 0, 0);
                    break;
                case 'finished':
                    console.log('DONE');
            }
            if (callback) callback(e.data);
        }, false);
    }

    setPixel(x, y, color) {
        var index = ((this.width * y) + x) * 4;
        this.imageData.data[index] = color.r;
        this.imageData.data[index + 1] = color.g;
        this.imageData.data[index + 2] = color.b;
        this.imageData.data[index + 3] = 255;
    }

    setRandomPixels() {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                var c = Math.round(Math.random() * 255);
                this.setPixel(x, y, new Color(c, c, c));
            }
        }
    }

    loadTexture(src, callback) {
        console.log('>> Creating canvas for texture: ' + src);
        var img = new Image();
        img.src = src;
        img.onload = function () {
            console.log('>> Loaded image: ' + src);
            var canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            document.body.appendChild(canvas);
            var ctx = canvas.getContext('2d');
            //draw background image
            ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
            var texture = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
            callback({
                data: texture.data,
                width: texture.width,
                height: texture.height
            });
            document.body.removeChild(canvas);
        };
    }
}