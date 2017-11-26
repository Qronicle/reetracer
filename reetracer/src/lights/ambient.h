#ifndef AMBIENT_LIGHT
#define AMBIENT_LIGHT

#include <string>
#include "light.h"

class AmbientLight : public Light
{
    public:

        AmbientLight(double intensity, Color color)
        {
            this->intensity = intensity;
            this->color = color;
        }

        std::string toString()
        {
            return "[AmbientLight]";
        }
};

#endif