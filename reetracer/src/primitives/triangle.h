#ifndef TRIANGLE
#define TRIANGLE

#include <math.h>
#include "vertex.h"
#include "displayobject.h"

class Triangle : public DisplayObject
{
    protected:
        Vector3 e1;
        Vector3 e2;
        Vector3 tangent;
        Vector3 bitangent;

    public:
        Vertex v1;
        Vertex v2;
        Vertex v3;
        Vector3 normal;
        bool renderBackside;
        bool renderFlat;

    Triangle (Vertex v1, Vertex v2, Vertex v3, bool renderBackside, bool renderFlat) : v1(v1), v2(v2), v3(v3)
    {
        // Init members
        this->v2 = v2;
        this->v3 = v3;
        this->renderBackside = renderBackside;
        this->renderFlat = renderFlat;
        // Calculate normal
        Vector3 u = v2.position - v1.position;
        Vector3 v = v3.position - v1.position;
        this->normal = Vector3(
            (u.y * v.z) - (u.z * v.y),
            (u.z * v.x) - (u.x * v.z),
            (u.x * v.y) - (u.y * v.x)
        ).unit();
        /*if (!v1.normal) v1.normal = this->normal;
        if (!v2.normal) v2.normal = this->normal;
        if (!v3.normal) v3.normal = this->normal;*/
        this->e1 = u;
        this->e2 = v;
        // Calculate tangent and bitangent
        if (this->normal.x != 0 || this->normal.z != 0) {
            this->tangent = this->normal.cross(VECTOR_UP);
        } else {
            this->tangent = Vector3(1, 0, 0);
        }
        this->bitangent = this->normal.cross(this->tangent);
    }

    TraceResult intersect(const Ray& ray)
    {
        TraceResult result;
        Vector3 h = ray.direction.cross(this->e2);
        double a = this->e1.dot(h);
        if (a == 0 || (!this->renderBackside && a < 0)) {
            return result;
        }
        double f = 1.0 / a;
        Vector3 s = ray.origin - this->v1.position;
        double u = f * s.dot(h);
        if (u < 0 || u > 1) {
            return result;
        }
        Vector3 q = s.cross(this->e1);
        double v = f * ray.direction.dot(q);
        if (v < 0 || u + v > 1) {
            return result;
        }
        double t = f * this->e2.dot(q);
        if (t >= 0) {
            result.hit = true;
            result.distance = t;
            result.u = u;
            result.v = v;
        }
        return result;
    }

    SurfaceProperties getSurfaceProperties(const Vector3& intersection, const TraceResult& traceResult)
    {
        Vector3 normal = this->getNormalAt(intersection, traceResult);
        double u = traceResult.u;
        double v = traceResult.v;
        if (this->v1.textureCoords != 0) {
            double textureX = (1.0 - u - v) * this->v1.textureCoords->x + u * this->v2.textureCoords->x + v * this->v3.textureCoords->x;
            double textureY = (1.0 - u - v) * this->v1.textureCoords->y + u * this->v2.textureCoords->y + v * this->v3.textureCoords->y;
            u = textureX;
            v = 1 - textureY;
        }
        SurfaceProperties surface;
        surface.normal = this->applyMaterialNormalOffset(normal, u, v);
        surface.u = u;
        surface.v = v;
        return surface;
    }

    Vector3 applyMaterialNormalOffset(const Vector3& normal, double u, double v)
    {
        if (this->material->hasNormalOffset()) {
            Vector3 offset = this->material->getNormalOffset(u, v);
            return offset.mapToTangentSpace(normal, this->tangent, this->bitangent);
        }
        return normal;
    }

    Vector3 getNormalAt(const Vector3& intersection, const TraceResult& traceResult)
    {
        Vector3 normal;
        if (this->renderFlat || this->v1.normal == 0) {
            normal = this->normal;
        } else {
            normal = (*(this->v1.normal) * (1 - traceResult.u - traceResult.v))
                + (*(this->v2.normal) * traceResult.u)
                + (*(this->v3.normal) * traceResult.v);
        }
        return this->applyMaterialNormalOffset(normal, traceResult.u, traceResult.v);
    }
};

#endif