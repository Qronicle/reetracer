#ifndef LIGHT
#define LIGHT

#include <string>
#include "../stdlib/color.h"
#include "../stdlib/structs.h"

class Light
{
    protected:

    public:
        double intensity;
        Color color;

        Light()
        {
            this->intensity = 1;
            this->color = Color(1, 1, 1);
        }

        Light(double intensity, Color& color)
        {
            this->intensity = intensity;
            this->color = color;
        }

        virtual double getIntensity(const TraceResult& traceResult, const SurfaceProperties& surfaceProperties, const Scene* scene)
        {
            return this->intensity;
        }

        virtual double getSpecularIntensity(const TraceResult& traceResult, const SurfaceProperties& surfaceProperties, const Scene* scene)
        {
            return 0;
        }

        virtual std::string toString()
        {
            return "[AbstractLight]";
        }
};

#endif