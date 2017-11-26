cls
emcc src/pong.cpp -o pong.generated.js^ --std=c++11 -O3 --bind^
 -s WASM=1^
 -s ALLOW_MEMORY_GROWTH=1