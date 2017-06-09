#ifndef SPHERE
#define SPHERE

#include <math.h>
#include "displayobject.h"

class Sphere : public DisplayObject
{
    protected:

    public:
        Vector3 position;
        double radius;
        double radius2;


        Sphere(Vector3 position, double radius)
        {
            this->position = position;
            this->setRadius(radius);
        }

        void setRadius(double radius)
        {
            this->radius = radius;
            this->radius2 = radius * radius;
        }

        TraceResult intersect(const Ray& ray)
        {
            TraceResult result;
            Vector3 v = ray.origin - this->position;
            double b = -(v.dot(ray.direction));
            double det = (b*b) - v.dot(v) + this->radius2;
            if (det > 0) {
                det = sqrt(det);
                double i1 = b - det;
                double i2 = b + det;
                if (i2 > 0) {
                    if (i1 < 0) {
                        //if (i2 < a_Dist) {
                        result.hit = true;
                        result.distance = i2;
                        result.inside = true;
                        //}
                    }
                    else {
                        //if (i1 < a_Dist) {
                        result.hit = true;
                        result.distance = i1;
                        //}
                    }
                }
            }
            return result;
        }

        SurfaceProperties getSurfaceProperties(const Vector3& intersection, const TraceResult& traceResult)
        {
            Vector3 normal = (intersection - this->position).unit();
            double u = atan2(normal.z, normal.x) / PI2;
            double v = (-asin(normal.y) / PI) - 0.5;
            SurfaceProperties surface;
            surface.normal = this->applyMaterialNormalOffset(normal, u, v);
            surface.u = u;
            surface.v = v;
            return surface;
        }

        Vector3 applyMaterialNormalOffset(const Vector3& normal, double u, double v)
        {
            /*double offset = this->material->getNormalOffset(u, v);
            if (offset) {
                if (normal.x != 0 || normal.z != 0) {
                    var tangent = normal.cross(Math2.VECTOR_UP).unit();
                } else {
                    tangent = new Vector3(0, 0, 1);
                }
                var bitangent = normal.cross(tangent).unit();
                if (bitangent.y > 0) bitangent = bitangent.negative();
                //console.log(normal, tangent, bitangent);
                return offset.mapToTangentSpace(normal, tangent, bitangent);
            }*/
            return normal;
        }

        std::string toString()
        {
            return "[Sphere]";
        }
};

#endif