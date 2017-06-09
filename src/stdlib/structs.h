#ifndef STD_STRUCTS
#define STD_STRUCTS

#include "color.h"
#include "vector3.h"

const double PI = 3.14159265358979323846;
const double PI2 = PI * 2;
const double EPSILON = 0.0000001;

struct SurfaceProperties {
    Vector3 intersection;
    Vector3 normal;
    double u;
    double v;
};

struct TraceResult {
    bool hit = false;
    double distance;
    bool inside = false;
    DisplayObject* object = nullptr;
    Color color;
};

#endif