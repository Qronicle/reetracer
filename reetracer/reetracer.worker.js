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
    ReeTracerWorker[e.data.type](e.data.params);
}, false);

ReeTracerWorker = {

    loadScene: function (sceneDescription) {
        console.log('>> Loading scene');
        const defaultSceneSettings = {
            width: 640,
            height: 480,
            numLightRays: 1,
            maxRayDepth: 3,
            ambientOcclusion: 0,
            ambientColor: [0, 0, 0],
        };
        for (const s in defaultSceneSettings) {
            if (typeof sceneDescription.settings[s] == 'undefined') {
                sceneDescription.settings[s] = defaultSceneSettings[s];
            }
        }
        this.scene = new ReeTracerModule.Scene(sceneDescription.settings);
        this.sceneDescription = sceneDescription;
        this.onFinished = callback;
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

    render: function(canvas) {
        if (!this.sceneLoaded) {
            return false;
        }
        console.log('>> Rendering scene');
        const context = canvas.getContext('2d');
        // Prepare canvas
        canvas.width = sceneDescription.settings.width;
        canvas.height = sceneDescription.settings.height;
        canvas.style.width = '100%';
        canvas.style.height = sceneDescription.settings.height;
        // Render the scene
        var start = new Date();
        data = this.scene.render();
        var end = new Date();
        const imageData = new ImageData(new Uint8ClampedArray(data), sceneDescription.settings.width, sceneDescription.settings.height);
        context.putImageData(imageData, 0, 0);
        console.log('   Done in ' + ((end - start) / 1000) + ' seconds');
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
        console.log('   > Started loading image: ' + src);
        const img = new Image();
        img.src = src;
        img.onload = function () {
            console.log('   > Loaded image: ' + src);
            // Get image data
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            document.body.appendChild(canvas);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
            const imageData = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
            document.body.removeChild(canvas);
            // Put image data on the HEAP
            const mem = ReeTracerModule._malloc(imageData.data.length);
            ReeTracerModule.writeArrayToMemory(imageData.data, mem);
            let textureData = ReeTracer.textureMap[index];
            textureData.width = img.naturalWidth;
            textureData.height = img.naturalHeight;
            textureData.address = mem;
            textureData.size = imageData.data.length;
            ReeTracer.texturesLoaded++;
            ReeTracer.tryAndContinue();
        };
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
            this.onFinished(this.scene);
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