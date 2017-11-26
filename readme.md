WEB ASSEMBLY & REETRACER
========================

This repository contains some WebAssembly (wasm) test scenarios and the ReeTracer.js project.
All WebAssembly code is generated from C++ source files.

This repository can be visited at http://wasm.qronicle.be

Web Assembly Tests
------------------

### Strings ###
Getting strings into c++ ain't that easy. 

### Desaturizer ###
A mini application that desaturizes an image either with Web Assembly or JavaScript. (Guess what's fastest!)
The image date is sent to a C style function, for sending the image data to a real C++ class, see the next test.

### Texture import ###
Load an image using canvas, put it in the c++ application and get it back again.

ReeTracer
---------

A Ray tracing engine originally written in JavaScript (see the legacy folder) and ported to C++.

Choose from different scenes to render using either Web Assembly or good ol' plain JavaScript.</p>

Pong
----

ReeTracer scene optimized to display pong.

Not playable (yet) though. 
Only renders the part were the ball is supposed to be.