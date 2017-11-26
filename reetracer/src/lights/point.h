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
            // NORMAL INTENSITY ////////////////////////////////////////////////////////////////////////////////////////

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
            if (!traceResult.object->getMaterial()->catchShadows) return dot;

            // Shadows
            Vector3 nDirection = Vector3(direction.x, direction.y, direction.z);
            for (int j = 0; j < scene->renderSettings.numLightRays; j++) {
                Ray shadowRay = Ray(
                    surfaceProperties.intersection + nDirection * EPSILON,
                    nDirection
                );
                TraceResult shadowResult = scene->miniTrace(shadowRay, true);
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
            shade = shade / scene->renderSettings.numLightRays;
            return dot * shade;
        }

        double getSpecularIntensity(const TraceResult& traceResult, const SurfaceProperties& surfaceProperties, const Scene* scene)
        {
            double intensity = 0;
            if (traceResult.object->getMaterial()->specular > 0) {
                Vector3 direction = (this->position - surfaceProperties.intersection).unit();
                double dot = direction.dot(surfaceProperties.reflectionDirection);
                if (dot > 0) {
                    //double spec = pow(dot, 20) * traceResult.object->getMaterial()->specular * intensity;
                    intensity = pow(dot, 20) * traceResult.object->getMaterial()->specular;
                    // add specular component to ray color
                    // color = color.add(light.color.multiply(spec)); //light.color.multiply(object.material.color).multiply(diff));*/
                }//*/
            }
            return intensity;
        }

        std::string toString()
        {
            return "[PointLight]";
        }
};

#endif