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
