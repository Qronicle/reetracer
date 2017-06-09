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
