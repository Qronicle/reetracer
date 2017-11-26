#ifndef TEXTURE
#define TEXTURE

struct txtr {
    int width, height;
    double scale = 1.0;
    double strength = 1.0;
    bool invertY = false, invertX = false, flipUV = false;
};

/**
 * @copyright   2016 Qronicle.be
 * @since       2016-12-13 19:43
 * @author      Ruud Seberechts
 */
class Texture
{
    protected:
        uint8_t* data;

    public:
        int width, height;
        double scale, strength;
        bool invertY, invertX, flipUV;

        Texture (uint8_t* data, txtr texture)
        {
            this->data     = data;
            this->width    = texture.width;
            this->height   = texture.height;
            this->scale    = texture.scale;
            this->strength = texture.strength;
            this->invertY  = texture.invertY;
            this->invertX  = texture.invertX;
            this->flipUV   = texture.flipUV;
        }

        Color getColorAt(int x, int y)
        {
            /*x = x < 0 ? x + this.width : x > this.width ? x - this.width : x;
            y = y < 0 ? y + this.height : y > this.height ? y - this.height : y;*/
            int s = ((this->width * y) + x) * 4;
            return Color(
                1.0 * this->data[s] / 255,
                1.0 * this->data[s + 1] / 255,
                1.0 * this->data[s + 2] / 255
            );
        }
};

#endif