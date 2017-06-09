export EMCC_DEBUG=1

reetracer.js: src/main.cpp
	em++ --bind --std=c++11 src/main.cpp -s WASM=1 -s ALLOW_MEMORY_GROWTH=1 -s RESERVED_FUNCTION_POINTERS=1 -o reetracer.js

clean:
	rm *.js *.wasm