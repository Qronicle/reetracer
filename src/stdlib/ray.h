#ifndef RAY
#define RAY

#include "vector3.h"

class Ray
{
    public:
        Vector3 origin;
        Vector3 direction;

        Ray (Vector3 origin, Vector3 direction)
        {
            this->origin = origin;
            this->direction = direction.unit();
        }

        std::string toString()
        {
            return "[Ray | origin: " + this->origin.toString() + " | direction: " + this->direction.toString() + "]";
        }
};

#endif