// For clarity
const PongModule = Module;

PongModule.onRuntimeInitialized = function () {
    Pong.init();
};

Pong = {

    init: function () {
        console.log('>> Initializing Pong');
        this.loadBgTexture('img/pitch.jpg');
        this.canvas = document.getElementById('canvas');
    },

    initScene: function (texture) {
        this.sceneSettings = {
            width: 600,
            height: 450,
            numLightRays: 1,
            maxRayDepth: 1,
            ambientOcclusion: 0,
            ambientColor: [0, 0, 0],
        };
        this.canvas.width = this.sceneSettings.width;
        this.canvas.height = this.sceneSettings.height;
        this.canvas.style.width = '100%';
        this.context = this.canvas.getContext('2d');
        this.scene = new PongModule.Scene(this.sceneSettings, texture.address, texture.width, texture.height);
        this._setReady();
    },

    render: function() {
        if (!this.start) {
            this.delta = 0;
        } else {
            this.delta = ((new Date()) - this.start) * 0.04;
        }
        // Render the scene
        this.start = new Date();
        data = this.scene.render(this.delta);
        const imageData = new ImageData(new Uint8ClampedArray(data), this.sceneSettings.width, this.sceneSettings.height);
        this.context.putImageData(imageData, 0, 0);

        //console.log('   Done in ' + ((end - start) / 1000) + ' seconds');
        setTimeout(function(){Pong.render()}, 1);
    },

    loadBgTexture: function (src) {
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
            const mem = PongModule._malloc(imageData.data.length);
            PongModule.writeArrayToMemory(imageData.data, mem);
            const textureData = {
                width: img.naturalWidth,
                height: img.naturalHeight,
                address: mem,
                size: imageData.data.length
            };
            Pong.initScene(textureData);
        };
    },

    // Ready Event Listener stuff //////////////////////////////////////////////////////////////////////////////////////

    readyListeners: [],

    ready: function (callback) {
        console.log('>> ReeTracer Module Loaded');
        if (this.isReady) {
            callback(this);
        } else {
            this.readyListeners.push(callback);
        }
    },

    _setReady: function () {
        this.isReady = true;
        for (var i = 0; i < this.readyListeners.length; i++) {
            this.readyListeners[i](this);
        }
        this.readyListeners = [];
    }
};