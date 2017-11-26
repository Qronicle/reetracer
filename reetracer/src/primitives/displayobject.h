#ifndef DISPLAY_OBJECT
#define DISPLAY_OBJECT

class DisplayObject;
class Triangle;

#include "../stdlib/structs.h"
#include "../material/material.h"

class DisplayObject
{
    protected:
        Material* material;

    public:
        virtual TraceResult intersect(const Ray& ray) = 0;
        virtual SurfaceProperties getSurfaceProperties(const Vector3& intersection, const TraceResult& traceResult) = 0;
        virtual Vector3 applyMaterialNormalOffset(const Vector3& normal, double u, double v) = 0;

        virtual std::string toString()
        {
            return "[DisplayObject]";
        }

        virtual void setMaterial(Material* material)
        {
            this->material = material;
        }

        Material* getMaterial()
        {
            return this->material;
        }
};

#include "sphere.h"
#include "plane.h"
#include "triangle.h"
#include "mesh.h"

#endif