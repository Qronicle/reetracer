// Initialize ReeTracerWorker and link postMessage to ReeTracer object
const worker = new Worker('reetracer.worker.js');
worker.addEventListener('message', function (e) {
    switch (e.data.type) {
        case 'ready':
            ReeTracer._setReady();
            break;
        default:
            console.debug('[Debug] Called on ReeTracer: ', e.data);
            ReeTracer[e.data.type](e.data.params || {});
    }
}, false);

ReeTracer = {

    loadScene: function (sceneDescription, callback) {
        this.onFinished = callback;
        this.isSceneLoaded = false;
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
        worker.postMessage({
            type: 'loadScene',
            params: sceneDescription
        });
        this.sceneDescription = sceneDescription;
    },

    render: function(canvas, callback) {
        if (!this.isSceneLoaded) {
            return false;
        }
        this.onFinished = callback;
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        // Render the scene
        worker.postMessage({
            type: 'render'
        });
    },

    loadTexture: function (params) {
        const src = params.src;
        const index = params.index;
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
            // Send image data to worker
            worker.postMessage({
                type: 'textureLoaded',
                params: {
                    src: src,
                    index: index,
                    data: imageData.data,
                    width: imageData.width,
                    height: imageData.height
                }
            });
        };
    },

    sceneLoaded: function(params) {
        this.isSceneLoaded = true;
        this.onFinished();
    },

    renderComplete: function(params) {
        this.canvas.width = this.sceneDescription.settings.width;
        this.canvas.height = this.sceneDescription.settings.height;
        this.canvas.style.width = '100%';
        this.canvas.style.height = this.sceneDescription.settings.height;
        const imageData = new ImageData(new Uint8ClampedArray(params.data), this.sceneDescription.settings.width, this.sceneDescription.settings.height);
        this.context.putImageData(imageData, 0, 0);
        this.onFinished();
    },

    // Ready Event Listener stuff //////////////////////////////////////////////////////////////////////////////////////

    readyListeners: [],

    ready: function (callback) {
        if (this.isReady) {
            callback(this);
        } else {
            this.readyListeners.push(callback);
        }
    },

    _setReady: function () {
        console.log('>> ReeTracer Module Loaded');
        this.isReady = true;
        for (var i = 0; i < this.readyListeners.length; i++) {
            this.readyListeners[i](this);
        }
        this.readyListeners = [];
    }
}