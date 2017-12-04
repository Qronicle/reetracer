importScripts('string.js');

self.addEventListener('message', function (e, f) {
    Module.onRuntimeInitialized = function(){
        const str = "p  0.015\np  102.455 ";
        const mem = Module._malloc(str.length);
        Module.writeAsciiToMemory(str, mem);
        Module.setString(mem, str.length);
    };
}, false);