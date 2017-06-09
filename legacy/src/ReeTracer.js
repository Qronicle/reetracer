/**
 * @copyright   2016 Qronicle.be
 * @since       2016-12-03 18:37
 * @author      Ruud Seberechts
 */
class ReeTracer {
    constructor(canvasId, sceneDescription, renderSettings = {}) {
        var canvas = document.getElementById(canvasId);
        renderSettings.width = renderSettings.width || 640;
        renderSettings.height = renderSettings.height || 480;
        canvas.width = renderSettings.width;
        canvas.height = renderSettings.height;

        this.bitmap = document.getElementById(canvasId).getContext('2d');
        this.imageData = this.bitmap.getImageData(0, 0, renderSettings.width, renderSettings.height);
        this.sceneDescription = sceneDescription;
        this.renderSettings = renderSettings;
    }

    render(callback) {
        var worker = new Worker('bin/reetracer.worker.js');
        var self = this;

        worker.postMessage({
            type: 'init',
            output: this.renderSettings,
            scene: this.sceneDescription,
        });
        worker.addEventListener('message', function (e) {
            switch (e.data.type) {
                case 'loadTexture':
                    self.loadTexture(e.data.src, function(texture){
                        worker.postMessage({
                            type: 'textureLoaded',
                            src: e.data.src,
                            texture: texture,
                        });
                    });
                    break;
                case 'addOutput':
                    var data = e.data;
                    var l = data.data.length;
                    for (var i = 0; i < l; i++) {
                        self.imageData.data[data.startIndex + i] = data.data[i];
                    }
                    self.bitmap.putImageData(self.imageData, 0, 0);
                    break;
                case 'finished':
                    console.log('DONE');
            }
            if (callback) callback(e.data);
        }, false);
    }

    setPixel(x, y, color) {
        var index = ((this.width * y) + x) * 4;
        this.imageData.data[index] = color.r;
        this.imageData.data[index + 1] = color.g;
        this.imageData.data[index + 2] = color.b;
        this.imageData.data[index + 3] = 255;
    }

    setRandomPixels() {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                var c = Math.round(Math.random() * 255);
                this.setPixel(x, y, new Color(c, c, c));
            }
        }
    }

    loadTexture(src, callback) {
        console.log('>> Creating canvas for texture: ' + src);
        var img = new Image();
        img.src = src;
        img.onload = function () {
            console.log('>> Loaded image: ' + src);
            var canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            document.body.appendChild(canvas);
            var ctx = canvas.getContext('2d');
            //draw background image
            ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
            var texture = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
            callback({
                data: texture.data,
                width: texture.width,
                height: texture.height
            });
            document.body.removeChild(canvas);
        };
    }
}