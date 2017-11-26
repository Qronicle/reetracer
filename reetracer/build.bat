cls
emcc src/main.cpp -o reetracer.generated.js^ --std=c++11 -O3 --bind^
 -s WASM=1^
 -s ASSERTIONS=1^
 -s ALLOW_MEMORY_GROWTH=1