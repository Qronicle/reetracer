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
+
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
Math2.VECTOR_FORWARD = new Vector3(0, 0, 1);