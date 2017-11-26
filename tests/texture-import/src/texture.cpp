#include <stdio.h>
#include <stdint.h>
#include <emscripten.h>
#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <map>

using namespace emscripten;

class Texture
{
    public:

        uint8_t *data;
        size_t len;
        int width;
        int height;

        Texture(uint8_t *data, int width, int height)
        {
            this->data = data;
            this->width = width;
            this->height = height;
            this->len = width * height * 4;
        }
};

class MaterialRepo
{
    public:

        std::map<int, Texture*> textures;
        Texture* texture;

        void addTexture(uint8_t *data, int width, int height)
        {
            Texture* texture = new Texture(data, width, height);
            MaterialRepo::texture = texture;
        }

        val getTexture()
        {
            return val(typed_memory_view(texture->len, texture->data));
        }
};

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

MaterialRepo repo = MaterialRepo();

void saveTexture(int imageData, int width, int height)
{
    uint8_t* data = reinterpret_cast<uint8_t*>(imageData);
    repo.addTexture(data, width, height);
}

val getTexture()
{
    return repo.getTexture();
}

EMSCRIPTEN_BINDINGS(hello) {
  function("saveTexture", &saveTexture, allow_raw_pointers());
  function("getTexture", &getTexture);
}