importScripts('reetracer.generated.js');

// For convenience
const ReeTracerModule = Module;
const worker = this;

// Let the main thread know we are ready when the WASM module is loaded
ReeTracerModule.onRuntimeInitialized = function () {
    worker.postMessage({type: 'ready'});
};

// Make ReeTracerWorker methods available for the main thread
worker.addEventListener('message', function (e, f) {
    console.debug('[Debug] Called on ReeTracerWorker: ', e.data.type, e.data.params);
    ReeTracerWorker[e.data.type](e.data.params);
}, false);

ReeTracerWorker = {

    loadScene: function (sceneDescription) {
        console.log('>> Loading scene');
        this.scene = new ReeTracerModule.Scene(sceneDescription.settings);
        this.sceneDescription = sceneDescription;
        this.errors = [];
        this.textures = [];
        this.meshes = [];
        this.status = 'Importing scene';
        this.textures = [];
        this.textureMap = [];
        this.sceneTextureMap = [];
        this.texturesLoaded = 0;
        this.sceneLoaded = false;
        this.textureProperties = ['diffuseTexture', 'bumpMap', 'normalMap'];
        this.loadDependencies();
    },

    render: function() {
        if (!this.sceneLoaded) {
            return false;
        }
        console.log('>> Rendering scene');
        // Render the scene
        const start = new Date();
        data = this.scene.render();
        const end = new Date();
        console.log('   Done in ' + ((end - start) / 1000) + ' seconds');
        worker.postMessage({
            type: 'renderComplete',
            params: {
                data: new Uint8ClampedArray(data)
            }
        });
    },

    loadDependencies: function () {
        // Load textures and all that jazz
        for (let i = 0; i < this.sceneDescription.objects.length; i++) {
            let material = this.sceneDescription.objects[i].material;
            for (let j = 0; j < this.textureProperties.length; j++) {
                let prop = this.textureProperties[j];
                if (material[prop] && material[prop].src) {
                    //material[prop].id = material[prop].id || this.generateId();
                    if (this.getTextureIndex(material[prop].src) === false) {
                        this.textureMap.push({src: material[prop].src});
                    }
                }
            }
        }
        let cont = true;
        if (this.textureMap.length > 0) {
            console.log('   Loading textures...');
        }
        for (i = 0; i < this.textureMap.length; i++) {
            this.loadTexture(this.textureMap[i].src, i);
            cont = false;
        }
        if (cont) {
            this.tryAndContinue();
        }
    },

    generateId: function()
    {
        this.genIdex = this.genIdex ? this.genIdex + 1 : 1;
        return '___' + this.genIdex;
    },

    loadTexture: function (src, index) {
        worker.postMessage({
            type: 'loadTexture',
            params: {
                src: src,
                index: index
            }
        });
    },

    textureLoaded: function (e) {
        // Put image data on the HEAP
        const mem = ReeTracerModule._malloc(e.data.length);
        ReeTracerModule.writeArrayToMemory(e.data, mem);
        let textureData = this.textureMap[e.index];
        textureData.width = e.width;
        textureData.height = e.height;
        textureData.address = mem;
        textureData.size = e.data.length;
        this.texturesLoaded++;
        this.tryAndContinue();
    },

    tryAndContinue: function () {
        if (this.texturesLoaded == this.textureMap.length) {
            if (this.texturesLoaded > 0) {
                console.log('   > Finished loading textures');
            }
            this.importLights();
            this.importObjects();
            this.status = 'Done importing';
            console.log('   Done');
            this.sceneLoaded = true;
            worker.postMessage({type:'sceneLoaded'});
        }
    },

    getTexture: function(src) {
        for (var i in this.textureMap) {
            if (this.textureMap[i].src == src) return this.textureMap[i];
        }
        return false;
    },

    getTextureIndex: function (src) {
        for (var i in this.textureMap) {
            if (this.textureMap[i].src == src) return i;
        }
        return false;
    },

    importLights: function () {
        console.log('   Importing light sources...');
        if (this.sceneDescription.lights.length) {
            for (let i = 0; i < this.sceneDescription.lights.length; i++) {
                let l = this.sceneDescription.lights[i];
                let light = null;
                if (!l.color) {
                    l.color = [255, 255, 255];
                }
                switch (l.type) {
                    case 'ambient':
                        this.scene.addAmbientLight(
                            l.intensity || 0,
                            l.color
                        );
                        break;
                    case 'point':
                        this.scene.addPointLight(
                            l.position,
                            l.intensity || 1,
                            l.innerRadius || -1,
                            l.outerRadius || -1,
                            l.color
                        );
                }
            }
        }
    },

    importObjects: function () {
        console.log('   Importing objects...');
        if (this.sceneDescription.objects.length) {
            for (let i = 0; i < this.sceneDescription.objects.length; i++) {
                let o = this.sceneDescription.objects[i];
                let objectIndex = null;
                switch (o.type) {
                    case 'sphere':
                        objectIndex = this.scene.addSphere(
                            o.center,
                            o.radius || 1
                        );
                        break;
                    case 'plane':
                        objectIndex = this.scene.addPlane(o.position, o.normal);
                        break;
                    case 'triangle':
                        let vertices = [];
                        for (let i = 0; i < 3; i++) {
                            vertices[i] = {
                                position: o.points[i],
                                normal: [0, 0, 0],
                                textureCoords: [0, 0, 0],
                                hasNormal: false,
                                hasTextureCoords: false
                            }
                        }
                        objectIndex = this.scene.addTriangle(
                            vertices[0], vertices[1], vertices[2],
                            o.renderBackside || true,
                            o.renderFlat || true,
                        );
                        break;
                    /*case 'polygon':
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
                        break;*/
                    case 'obj':
                        const rawFile = new XMLHttpRequest();
                        rawFile.open("GET", o.file, false);
                        var self = this;
                        rawFile.onreadystatechange = function () {
                            if (rawFile.readyState === 4) {
                                if (rawFile.status === 200 || rawFile.status == 0) {
                                    console.log('   Loaded mesh from ' + o.file);
                                    /*var allText = rawFile.responseText;
                                    self.parseObj(allText);*/
                                } else {
                                    console.error('Error loading mesh from ' + o.file);
                                }
                            }
                        };
                        rawFile.send(null);
                        //console.log(rawFile.responseText);
                        const mem = Module._malloc(rawFile.responseText.length);
                        Module.writeAsciiToMemory(rawFile.responseText, mem);
                        objectIndex = this.scene.addObj(
                            mem,
                            o.scale || 1,
                            o.offset || [0, 0, 0],
                            o.rotate || [0, 0, 0],
                            o.renderBackside || false,
                            o.renderFlat || false,
                            o.invertNormals || false
                        );
                        break;
                }
                if (objectIndex !== null) {
                    let material = {
                        diffuseColor: [0, 0, 0],
                        diffuseTexture: -1,
                        normalMap: -1,
                        bumpMap: -1,
                        reflection: 0,
                        roughness: 0,
                        specular: 0,
                        refraction: 0,
                        refractionIndex: 0,
                        castShadows: true,
                        catchShadows: true
                    };
                    for (let prop in material) {
                        if (typeof o.material[prop] != 'undefined') {
                            if (this.textureProperties.indexOf(prop) == -1) {
                                material[prop] = o.material[prop];
                            } else {
                                const texture = this.getTexture(o.material[prop].src);
                                if (texture) {
                                    let textureInfo = {
                                        width    : texture.width,
                                        height   : texture.height,
                                        scale    : o.material[prop].scale || 1,
                                        strength : o.material[prop].strength || 1,
                                        invertY  : o.material[prop].invertY || false,
                                        invertX  : o.material[prop].invertX || false,
                                        flipUV   : o.material[prop].flipUV || false
                                    };
                                    material[prop] = this.scene.addTexture(texture.address, textureInfo);
                                } else {
                                    material[prop] = -1;
                                }
                            }
                        }
                    }
                    //console.log(material);
                    let materialIndex = this.scene.addMaterial(material);
                    this.scene.setObjectMaterial(objectIndex, materialIndex);
                }
            }
        }
    }
};