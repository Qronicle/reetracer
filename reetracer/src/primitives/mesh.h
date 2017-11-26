#ifndef MESH
#define MESH

#include <math.h>
#include "displayobject.h"

using namespace std;

class Mesh : public DisplayObject
{
    protected:
        Sphere* boundingSphere;

    public:
        vector<Triangle*> triangles{};

        Mesh(vector<Triangle*> triangles)
        {
            this->triangles = triangles;
            this->calculateBoundingSphere();
        }

        void calculateBoundingSphere()
        {
            Vector3 pos;
            // Calculate center
            Vector3 minVector = Vector3(INT_MAX, INT_MAX, INT_MAX);
            Vector3 maxVector = Vector3(INT_MIN, INT_MIN, INT_MIN);
            for (auto triangle:this->triangles) {
                // Vertex 1
                pos = triangle->v1.position;
                minVector.x = min(minVector.x, pos.x);
                minVector.y = min(minVector.y, pos.y);
                minVector.z = min(minVector.z, pos.z);
                maxVector.x = max(maxVector.x, pos.x);
                maxVector.y = max(maxVector.y, pos.y);
                maxVector.z = max(maxVector.z, pos.z);
                // Vertex 2
                pos = triangle->v2.position;
                minVector.x = min(minVector.x, pos.x);
                minVector.y = min(minVector.y, pos.y);
                minVector.z = min(minVector.z, pos.z);
                maxVector.x = max(maxVector.x, pos.x);
                maxVector.y = max(maxVector.y, pos.y);
                maxVector.z = max(maxVector.z, pos.z);
                // Vertex 3
                pos = triangle->v3.position;
                minVector.x = min(minVector.x, pos.x);
                minVector.y = min(minVector.y, pos.y);
                minVector.z = min(minVector.z, pos.z);
                maxVector.x = max(maxVector.x, pos.x);
                maxVector.y = max(maxVector.y, pos.y);
                maxVector.z = max(maxVector.z, pos.z);
            }
            Vector3 sphereCenter = (minVector + maxVector) * 0.5;

            // Calculate radius
            double sphereRadius = 0;
            double dist;
            for (auto triangle:this->triangles) {
                pos = triangle->v1.position;
                dist = pos.squareDistanceTo(sphereCenter);
                if (dist > sphereRadius) sphereRadius = dist;
            }

            // Set bounding sphere
            this->boundingSphere = new Sphere(sphereCenter, sqrt(sphereRadius) + 0.1);
        }

        TraceResult intersect(const Ray& ray)
        {
            TraceResult result;
            TraceResult intersection = this->boundingSphere->intersect(ray);
            if (!intersection.hit) {
                return result;
            }
            double minDist = -1;
            for (auto triangle:this->triangles) {
                intersection = triangle->intersect(ray);
                if (intersection.hit && (minDist == -1 || intersection.distance < minDist)) {
                    intersection.triangle = triangle;
                    minDist = intersection.distance;
                    result = intersection;
                }
            }
            return result;
        }

        SurfaceProperties getSurfaceProperties(const Vector3& intersection, const TraceResult& traceResult)
        {
            return traceResult.triangle->getSurfaceProperties(intersection, traceResult);
        }

        // Not used, because it goes to the triangle version :)
        Vector3 applyMaterialNormalOffset(const Vector3& normal, double u, double v)
        {
            return normal;
        }

        void setMaterial(Material* material)
        {
            this->material = material;
            for (auto t:this->triangles) {
                t->setMaterial(material);
            }
        }

        std::string toString()
        {
            return "[Mesh]";
        }
};

#endif