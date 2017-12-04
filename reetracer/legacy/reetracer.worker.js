importScripts('reetracer.lib.js');
var renderer = null;

self.addEventListener('message', function (e, f) {
    switch (e.data.type) {
        case 'init':
            e.data.renderer = this;
            renderer = new Renderer(e.data);
            break;
        case 'textureLoaded':
            renderer.textureLoaded(e.data.src, e.data.texture);
            break;
    }
}, false);

class Renderer {
    constructor(settings) {
        this.settings = settings;
        this.width = this.settings.output.width;
        this.height = this.settings.output.height;
        this.imageData = {type: 'addOutput', startIndex: 0, data: []}; //this.bitmap.getImageData(0, 0, this.width, this.height);
        this.startTime = new Date();
        var self = this;
        this.sceneImporter = new SceneImporter(this, function(scene){
            console.log('START RENDERING');
            self.scene = scene;
            self.render();
        });
    }

    loadTexture(texture) {
        this.settings.renderer.postMessage({type: 'loadTexture', src: texture});
    }

    textureLoaded(src, texture) {
        this.sceneImporter.textureLoaded(src, texture);
    }

    render() {
        this.settings.renderer.postMessage('Renderer started');
        var camera = this.scene.camera;
        var startTime = performance.now();
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var ray = camera.getRay(x / (this.width - 1), y / (this.height - 1));
                var result = this.scene.rayTrace(ray);
                var color = result.color;
                this.setPixel(color);
                /*var currTime = performance.now();
                if (currTime - startTime > 100) {
                    startTime = currTime;
                    this.settings.renderer.postMessage(this.imageData);
                    this.imageData.startIndex += this.imageData.data.length;
                    this.imageData.data = [];
                }*/
            }
        }
        var endTime = new Date();
        console.log('RENDER TIME: ' + ((endTime - this.startTime) / 1000) + ' seconds');
        if (this.imageData.data.length > 0) {
            this.settings.renderer.postMessage(this.imageData);
        }
        this.settings.renderer.postMessage({
            type: 'finished'
        });
    }

    setPixel(color) {
        this.imageData.data.push(color.getR());
        this.imageData.data.push(color.getG());
        this.imageData.data.push(color.getB());
        this.imageData.data.push(255);
    }
}