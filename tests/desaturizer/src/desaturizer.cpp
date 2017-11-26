#include <stdio.h>
#include <stdint.h>
#include <emscripten.h>
#include <emscripten/bind.h>
#include <emscripten/val.h>

using namespace emscripten;

/*val desaturize()
{
    uint8_t *imageData; size_t len = 0;
    int avg;
    for (int i = 0; i < len; i += 4) {
        avg = (imageData[i] + imageData[i+1] + imageData[i+2]) / 3;
        imageData[i] = avg;
        imageData[i+1] = avg;
        imageData[i+2] = avg;
    }
    //return imageData;
    return val(typed_memory_view(len, imageData));
}*/

extern "C" {
    void desaturize(unsigned char* imageData, int len)
    {
        int avg;
        for (int i = 0; i < len; i += 4) {
            avg = (imageData[i] + imageData[i+1] + imageData[i+2]) / 3;
            imageData[i] = avg;
            imageData[i+1] = avg;
            imageData[i+2] = avg;
        }
    }
    EMSCRIPTEN_BINDINGS(saywut) {
        function("_desaturize", &desaturize, allow_raw_pointers());
    }
}