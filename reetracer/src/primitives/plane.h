#ifndef PLANE
#define PLANE

#include <math.h>
#include "displayobject.h"

class Plane : public DisplayObject
{
    protected:

    public:
        Vector3 position;
        Vector3 normal;
        Vector3 tangent;
        Vector3 bitangent;

        Plane (Vector3 position, Vector3 normal) 
        {
            this->position = position;
            this->normal = normal;
            // Calculate tangent and bitangent
            if (normal.x != 0 || normal.z != 0) {
                this->tangent = this->normal.cross(VECTOR_UP);
            } else {
                this->tangent = Vector3(1, 0, 0);
            }
            this->bitangent = this->normal.cross(this->tangent);
        }
    
        TraceResult intersect(const Ray& ray)
        {
            TraceResult result;
            double denom = this->normal.dot(ray.direction);
            if (abs(denom) > EPSILON) {
                double t = (this->position - ray.origin).dot(this->normal) / denom;
                if (t >= 0) {
                    result.hit = true;
                    result.distance = t;
                }
            }
            return result;
        }
    
        Vector3 applyMaterialNormalOffset(const Vector3& normal, double u, double v)
        {
            if (this->material->hasNormalOffset()) {
                Vector3 offset = this->material->getNormalOffset(u, v);
                return offset.mapToTangentSpace(normal, this->tangent, this->bitangent);
            }
            return normal;
        }
    
        SurfaceProperties getSurfaceProperties(const Vector3& intersection, const TraceResult& traceResult)
        {
            double u = intersection.dot(this->tangent);
            double v = intersection.dot(this->bitangent);

            SurfaceProperties surface;
            surface.normal = this->applyMaterialNormalOffset(normal, u, v);
            surface.u = u;
            surface.v = v;
            return surface;
        }

        std::string toString()
        {
            return "[Plane]";
        }
};

#endif