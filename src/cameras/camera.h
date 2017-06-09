#ifndef CAMERA
#define CAMERA

#include "../stdlib/ray.h"

class Camera
{
    protected:
        double width, height, halfWidth, halfHeight, originDist;

    public:

        Camera (double width, double height, double originDist)
        {
            this->width = width;
            this->height = height;
            this->originDist = originDist;
            this->halfWidth = 0.5 * width;
            this->halfHeight = 0.5 * height;
        }

        Ray getRay(double x, double y)
        {
            Vector3 origin = Vector3(
                1.0 * x * this->width - this->halfWidth,
                -(1.0 * y * this->height - this->halfHeight),
                0.0
            );
            Vector3 direction = Vector3(
                origin.x,
                origin.y,
                this->originDist
            );
            return Ray(origin, direction);
        }
};

#endif