#ifndef POINT_LIGHT
#define POINT_LIGHT

#include <string>
#include "light.h"

class PointLight : public Light
{
    protected:
        double innerRadius, outerRadius, radiusDiff;
        Vector3 position;

    public:

        PointLight(Vector3 position, double intensity, double innerRadius, double outerRadius, Color color)
        {
            this->intensity = intensity;
            this->color = color;
            this->position = position;
            this->innerRadius = innerRadius;
            this->outerRadius = outerRadius;
            this->radiusDiff = this->outerRadius - this->innerRadius;
        }

        double getIntensity(const TraceResult& traceResult, const SurfaceProperties& surfaceProperties, const Scene* scene)
        {
            double shade = 0.0;
            // Lighting
            Vector3 direction = (this->position - surfaceProperties.intersection).unit();
            double dot = surfaceProperties.normal.dot(direction);
            if (dot > 0) {
                double intensity = this->intensity;
                if (this->outerRadius >= 0) {
                    double distToLight = surfaceProperties.intersection.distanceTo(this->position);
                    if (distToLight >= this->outerRadius) {
                        intensity = 0;
                    } else if (distToLight > this->innerRadius) {
                        intensity = (1 - ((distToLight - this->innerRadius) / this->radiusDiff)) * intensity;
                    }
                }
                dot *= intensity;
            }
            if (dot <= 0) return 0;

            Vector3 nDirection = Vector3(direction.x, direction.y, direction.z);
            for (int j = 0; j < scene->numLightRays; j++) {
                Ray shadowRay = Ray(
                    surfaceProperties.intersection + nDirection * EPSILON,
                    nDirection
                );
                TraceResult shadowResult = scene->miniTrace(shadowRay);
                if (shadowResult.hit && shadowResult.distance > 0 && pow(shadowResult.distance, 2) < surfaceProperties.intersection.squareDistanceTo(this->position)) {
                    //shades.push(0);
                    if (shadowResult.inside) {
                        shade += 1.0;
                    }
                } else {
                    shade += 1.0;
                }
                nDirection = direction.randomize(0.01);
            }
            shade = shade / scene->numLightRays;
            return dot * shade;
        }

        std::string toString()
        {
            return "[PointLight]";
        }
};

#endif