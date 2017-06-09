/**
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
}