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
        //console.log(lines);
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
}