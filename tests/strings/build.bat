cls
emcc src/string.cpp -o string.js^ --std=c++11 --bind^
 -s WASM=1^
 -s ALLOW_MEMORY_GROWTH=1