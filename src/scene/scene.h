#ifndef SCENE
#define SCENE

class Scene;

#include <iostream>
#include <map>
#include "../cameras/camera.h"
#include "../primitives/displayobject.h"
#include "../lights/light.h"

using namespace std;

class Scene
{
    protected:
        int width, height;
        uint8_t *buffer = nullptr;
        size_t bufferSize = 0;
        Color ambientColor = Color(0, 0, 0);

        Camera camera = Camera(4.0, 3.0, 4.0);

    public:
        map<int, DisplayObject*> objects;
        map<int, Light*> lights;

        int numLightRays = 1;

        Scene(int width, int height)
        {
            this->width = width;
            this->height = height;
            this->bufferSize = this->width * this->height * 4;
            this->buffer = (uint8_t *)malloc(this->bufferSize);
        }

        void addObject(int id, DisplayObject* object)
        {
            this->objects[id] = object;
        }

        void addLight(int id, Light* light)
        {
            this->lights[id] = light;
        }

        emscripten::val render()
        {
            for (int y = 0; y < this->height; y++) {
                for (int x = 0; x < this->width; x++) {
                    Ray ray = this->camera.getRay(1.0 * x / (this->width - 1), 1.0 * y / (this->height - 1));
                    TraceResult result = this->rayTrace(ray);
                    //draw the pixel
                    size_t bufferOffset = (x + y * this->width) * 4;
                    this->buffer[bufferOffset + 0] = result.color.getRed();
                    this->buffer[bufferOffset + 1] = result.color.getGreen();
                    this->buffer[bufferOffset + 2] = result.color.getBlue();
                    this->buffer[bufferOffset + 3] = 255;
                }
            }
            return emscripten::val(emscripten::typed_memory_view(this->bufferSize, this->buffer));
        }

        TraceResult miniTrace(const Ray& ray) const
        {
            TraceResult finalResult;
            DisplayObject* closest = nullptr;
            double distance = 0;

            map<int, DisplayObject*>::const_iterator it;
            for (it = this->objects.begin(); it != this->objects.end(); it++) {
                DisplayObject* object = it->second;
                TraceResult traceResult = object->intersect(ray);
                if (traceResult.hit && traceResult.distance > EPSILON) {
                    if (closest == nullptr || traceResult.distance < distance) {
                        closest = object;
                        distance = traceResult.distance;
                        finalResult = traceResult;
                    }
                }

            }
            if (!closest) {
                finalResult.color = this->ambientColor;
                return finalResult;
            }
            finalResult.object = closest;
            return finalResult;
        }

        TraceResult rayTrace(const Ray& ray)
        {
            return this->rayTrace(ray, 1, 0);
        }

        TraceResult rayTrace(const Ray& ray, double refractionIndex, int depth)
        {
            // Find closest object
            TraceResult traceResult = this->miniTrace(ray);
            if (!traceResult.hit) return traceResult;
            DisplayObject* object = traceResult.object;
            // Calculation point of intersection and normal
            Vector3 intersection = ray.origin + ray.direction * traceResult.distance;
            SurfaceProperties surfaceProperties = object->getSurfaceProperties(intersection, traceResult);
            surfaceProperties.intersection = intersection;
            // Reflection ray
            Vector3 reflectionDirection;
            if (object->getMaterial()->reflection > 0 || object->getMaterial()->specular > 0) {
                reflectionDirection = ray.direction - surfaceProperties.normal * (ray.direction.dot(surfaceProperties.normal) * 2.0);
            }//*/
            // Calculate object color
            Color color;
            // Scene lights
            map<int, Light*>::iterator lightsIt;
            for (lightsIt = this->lights.begin(); lightsIt != this->lights.end(); lightsIt++) {
                Light* light = lightsIt->second;
                double intensity = light->getIntensity(traceResult, surfaceProperties, this);
                // calculate diffuse shading
                if (true) { //object->getMaterial()->diffuse) {
                    color.add(light->color * object->getMaterial()->getDiffuseColor(surfaceProperties) * intensity);
                }//*/
                /*/ determine specular component
                if (object.material.specular > 0 && light instanceof PointLight) {
                    // point light source: sample once for specular highlight
                    var direction = light.position.subtract(hit.intersection).unit();
                    var dot = direction.dot(reflectionDirection);
                    if (dot > 0) {
                        var spec = Math.pow(dot, 20) * object.material.specular * intensity;
                        // add specular component to ray color
                        color = color.add(light.color.multiply(spec)); //light.color.multiply(object.material.color).multiply(diff));
                    }
                }//*/
            }
            traceResult.color = color;
            return traceResult;

                /*/ Ambient Occlusion
                if (this.renderSettings.ambientOcclusion) {
                    var ambientShade = 0;
                    var ambDist = 5;
                    for (j = 0; j < this.renderSettings.ambientOcclusion; j++) {
                        var ambientDir = normal.randomize(1);
                        var ambientRay = new Ray(intersection.add(ambientDir.multiply(0.0000001)), ambientDir);
                        var ambientResult = this.miniTrace(ambientRay);
                        if (ambientResult.displayObject && ambientResult.distance > 0) {
                            if (ambientResult.distance <= ambDist) {
                                ambientShade += (ambDist - ambientResult.distance) / ambDist;
                            }
                        }
                    }
                    ambientShade = ambientShade / this.renderSettings.ambientOcclusion;
                    shade = (1 - ambientShade) * 0.8;
                    color = color.multiply(0.5 + shade * 0.5);
                }//*/
                /*/ Reflection
                if (object.material.reflection > 0 && depth < this.maxRayDepth) {
                    var reflectionRay = new Ray(hit.intersection.add(reflectionDirection.multiply(Math2.EPSILON)), reflectionDirection);
                    var reflectionResult = this.rayTrace(reflectionRay, refractionIndex, depth + 1);
                    var reflectionColor = reflectionResult.color;
                    color = color.multiply(1 - object.material.reflection).add(reflectionColor.multiply(object.material.reflection));
                    //color = color.add(object.material.color.multiply(reflectionColor.multiply(object.material.reflection)));
                }//*/
                /*/ Refraction
                 if (object.material.refraction > 0 && depth < this.maxRayDepth) {
                 var n = refractionIndex / object.material.refractionIndex;
                 var refractionNormal = normal;
                 if (insideDisplayObject) {
                 refractionNormal = refractionNormal.negative();
                 }
                 var cosI = -refractionNormal.dot(ray.direction);
                 var cosT2 = 1 - n * n * (1 - cosI * cosI);
                 if (cosT2 > 0) {
                 var t = ray.direction.multiply(n).add(refractionNormal.multiply(n * cosI - Math.sqrt(cosT2)));
                 var refractionRay = new Ray(intersection.add(t.multiply(0.0000001)), t);
                 var refractionResult = this.rayTrace(refractionRay, object.material.refractionIndex, depth + 1);
                 // apply Beer's law
                 var refractionHitDistance = refractionResult ? refractionResult.distance : 1000000;
                 var absorbance = object.material.color.multiply(0.15 * -refractionHitDistance);
                 var transparency = new Color(Math.exp(absorbance.r), Math.exp(absorbance.g), Math.exp(absorbance.b));
                 color = color.add(refractionResult.color.multiply(transparency));
                 //
                 }
                 }//*/
                /*/ Dust
                 if (Math.random() > 0.2 && depth == 0 && distance > 0 && distance < 20) {
                 var dustPositions = [];
                 for (i = 0; i < Math.ceil(distance); i++) {
                 var dd = Math.random() + i;
                 if (dd < distance) {
                 dustPositions.push(ray.origin.add(ray.direction.multiply(dd)));
                 }
                 }
                 if (dustPositions.length) {
                 shade = 0;
                 var m = 1 / this.lights.length;
                 for (var dp in dustPositions) {
                 for (i in this.lights) {
                 // Lighting
                 light = this.lights[i]; //p
                 direction = light.position.subtract(dustPositions[dp]).unit();
                 shadowRay = new Ray(dustPositions[dp], direction);
                 shadowResult = this.miniTrace(shadowRay);
                 if (shadowResult.displayObject && shadowResult.distance > 0 && Math.pow(shadowResult.distance, 2) < dustPositions[dp].squareDistanceTo(light.position)) {
                 //shade += 0.5 * m;
                 } else {
                 shade += m;
                 }
                 }
                 }
                 shade /= dustPositions.length;
                 color = color.multiply(shade);
                 }
                 }//*/

            }
};

#endif