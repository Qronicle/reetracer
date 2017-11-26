emcc src/desaturizer.cpp -o desaturizer_c.js^ --std=c++11 -lm -O3^
 -s WASM=1^
 -s EXPORTED_FUNCTIONS="['_desaturize']"^
 -s ALLOW_MEMORY_GROWTH=1