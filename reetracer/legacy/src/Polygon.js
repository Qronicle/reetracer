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
