var Module = {};

/*function isImageData(element) {
    return element instanceof ImageData;
};

function isCanvasImageSource(element) {
    return (
        element instanceof HTMLCanvasElement ||
        element instanceof HTMLImageElement ||
        element instanceof HTMLVideoElement ||
        element instanceof ImageBitmap
    );
};

function toCanvas(source) {
    console.assert(isCanvasImageSource(source));
    if (source instanceof HTMLCanvasElement) {
        return source;
    }
    var canvas = document.createElement('canvas'); // draw to a temp canvas
    canvas.width = source.videoWidth || source.naturalWidth || source.width;
    canvas.height =  source.videoHeight || source.naturalHeight || source.height;
    canvas.getContext('2d').drawImage(source, 0, 0, canvas.width, canvas.height);
    return canvas;
};

// Reads image data from ImageData or CanvasImageSource(HTMLCanvasElement or HTMLImageElement or HTMLVideoElement or ImageBitmap)
// TODO: maybe CanvasRenderingContext2D and Blob also?
function readImageData(source) {
    console.assert(source);
    if (isImageData(source)) {
        return source;
    }
    var canvas = toCanvas(source);
    return canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
};

function writeImageDataToCanvas(canvas, data, width, height) {
    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext('2d');
    var imageData = context.createImageData(width, height);
    imageData.data.set(data);
    context.putImageData(imageData, 0, 0);
    return canvas;
};

// Writes image data into ImageData, HTMLCanvasElement, HTMLImageElement or creates a new canvas and appends it
function writeImageData(dest, data, width, height) {
    console.assert(dest);

    if (typeof dest === 'function') {
        dest(data, width, height);
        return;
    }

    if (isImageData(dest)) {
        console.assert(dest.width === width, dest.height === height);
        dest.data.set(data);
        return;
    }

    console.assert(dest instanceof HTMLElement);
    console.assert(!(dest instanceof HTMLVideoElement), 'Cannot write to video element');
    var canvas = (dest instanceof HTMLCanvasElement) ? dest : document.createElement('canvas');
    writeImageDataToCanvas(canvas, data, width, height);

    if (!(dest instanceof HTMLCanvasElement)) {
        if (dest instanceof HTMLImageElement) {
            dest.src = canvas.toDataURL();
        } else {
            dest.appendChild(canvas);
        }
    }
};

function drawVideo(element, destination) {
    const canvas = document.createElement('canvas');
    canvas.width = element.videoWidth;
    canvas.height =  element.videoHeight;
    context = canvas.getContext('2d');
    context.drawImage(element, 0, 0, canvas.width, canvas.height);
    pixels = context.getImageData(0, 0, element.width, element.height);
    pixels.data.set(filter(pixels.data));
    // context.putImageData(pixels, 0, 0);
    if (!destination) {
        const dest = document.querySelector('#wasm-canvas');
        if (!dest) {
            const newCanvas = document.createElement('canvas');
            newCanvas.id = 'wasm-canvas';
            const newContext = newCanvas.getContext('2d');
        }
    }
}

function createFilter(filter) {
    return function(element, destination) {
        if (element instanceof HTMLVideoElement) {
            if (!element.paused) requestAnimationFrame(drawVideo(element, destination));
            return;
        }
        if (element instanceof HTMLCanvasElement) {
            const context = element.getContext('2d');
            const pixels = context.getImageData(0, 0, element.width, element.height);
            pixels.data.set(filter(pixels.data));
            context.putImageData(pixels, 0, 0);
        }
    }
}*/

function initDesaturizer() {
    return new Promise((resolve, reject) => {
        if (!('WebAssembly' in window)) {
            console.log('Couldn\'t load WASM, loading JS Fallback');
            const fbScript = document.createElement('script');
            fbScript.src = './lib/webdsp_polyfill.js';
            fbScript.onload = function() {
                return resolve(jsFallback());
            };
            document.body.appendChild(fbScript);
        } else {
            // TODO: use xmlhttprequest where fetch not supported
            fetch('./desaturizer_c.wasm')
                .then(response => response.arrayBuffer())
                .then(buffer => {
                    Module.wasmBinary = buffer;
                    // GLOBAL -- create custom event for complete glue script execution
                    let script = document.createElement('script');
                    script.addEventListener('load', buildDesaturizer);
                    // END GLOBAL

                    // TODO: IN EMSCRIPTEN GLUE INSERT
                    // else{doRun()} ...
                    // script.dispatchEvent(doneEvent);
                    // ... }Module["run"]

                    script.src = './desaturizer_c.js';
                    document.body.appendChild(script);

                    function buildDesaturizer() {
                        console.log('Emscripten boilerplate loaded.');
                        const Desaturizer = {};

                        // filters
                        Desaturizer['desaturize'] = function (pixelData) {
                            const len = pixelData.length;
                            const mem = _malloc(len);
                            endTiming('alloc');
                            HEAPU8.set(pixelData, mem);
                            endTiming('set heap');
                            _desaturize(mem, len);
                            endTiming('Desaturize');
                            const filtered = HEAPU8.subarray(mem, mem + len);
                            endTiming('filtered');
                            _free(mem);
                            endTiming('free');
                            return filtered;
                        };
                        //end convFilter family of filters
                        resolve(Desaturizer);
                    }
                });
        }
    });
}