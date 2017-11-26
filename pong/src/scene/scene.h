#ifndef SCENE
#define SCENE

class Scene;

#include <iostream>
#include <map>

using namespace std;

struct RenderSettings {
    int width;
    int height;
    int numLightRays;
    int maxRayDepth;
    int ambientOcclusion;
    vct3 ambientColor;
};

bool ballHit = false;

class Scene
{
    protected:
        int objectIndex = 0;
        int lightIndex = 0;
        int materialIndex = 0;
        int textureIndex = 0;

        int width, height;
        uint8_t* buffer = nullptr;
        uint8_t* staticBuffer;
        size_t bufferSize = 0;
        Color ambientColor = Color(0, 0, 0);

        Camera* camera = nullptr;

        Sphere* ball;
        Sphere* player1;
        Sphere* player2;
        Plane* bg;

        double fieldWidth = 6.7;
        double fieldHeight = 4.9;

        Vector3 ballVector = Vector3(0.2, 0.1, 0);

        int ballBoundL = 350;
        int ballBoundR = 450;
        int ballBoundT = 350;
        int ballBoundB = 250;
        int ballBoundWidth;
        int ballBoundX;
        int ballBoundY;
        double ballBoundFactor = 0.0;


    public:
        map<int, DisplayObject*> objects;
        map<int, Light*> lights;
        map<int, Material*> materials;
        map<int, Texture*> textures;

        RenderSettings renderSettings;

        Scene(RenderSettings renderSettings, int bgTextureAddress, int bgTextureWidth, int bgTextureHeight)
        {
            // Initialize render settings
            this->width = renderSettings.width;
            this->height = renderSettings.height;
            this->bufferSize = this->width * this->height * 4;
            this->buffer = (uint8_t *)malloc(this->bufferSize);
            this->staticBuffer = (uint8_t *)malloc(this->bufferSize);
            this->camera = new Camera(
                1.0 * this->width / this->height * 3,
                3.0,
                4.0
            );
            this->ambientColor = Color(renderSettings.ambientColor);
            this->renderSettings = renderSettings;

            this->ballBoundFactor = 0.5 * this->width / this->fieldWidth;
            this->ballBoundWidth = ceil(1.0 * this->width / 8);
            this->ballBoundX = (this->width - this->ballBoundWidth) * 0.5;
            this->ballBoundY = (this->height - this->ballBoundWidth) * 0.5;

            this->init(bgTextureAddress, bgTextureWidth, bgTextureHeight);
        }

        void init(int bgTextureAddress, int bgTextureWidth, int bgTextureHeight);

        void addObject(int id, DisplayObject* object)
        {
            this->objects[id] = object;
        }

        void addLight(int id, Light* light)
        {
            this->lights[id] = light;
        }

        void renderStaticContent()
        {
            for (int y = 0; y < this->height; y++) {
                for (int x = 0; x < this->width; x++) {
                    Ray ray = this->camera->getRay(1.0 * x / (this->width - 1), 1.0 * y / (this->height - 1));
                    TraceResult result = this->rayTrace(ray);
                    //draw the pixel
                    size_t bufferOffset = (x + y * this->width) * 4;
                    this->staticBuffer[bufferOffset + 0] = result.color.getRed();
                    this->staticBuffer[bufferOffset + 1] = result.color.getGreen();
                    this->staticBuffer[bufferOffset + 2] = result.color.getBlue();
                    this->staticBuffer[bufferOffset + 3] = 255;
                }
            }
        }

        void tick(double delta)
        {
            this->ball->position.x += this->ballVector.x * delta;
            this->ball->position.y += this->ballVector.y * delta;

            if (this->ball->position.x > this->fieldWidth) {
                this->ballVector.x = -abs(this->ballVector.x);
                this->ball->position.x -= this->ball->position.x - this->fieldWidth;
            } else if (this->ball->position.x < -this->fieldWidth) {
                this->ballVector.x = abs(this->ballVector.x);
                this->ball->position.x += -this->ball->position.x - this->fieldWidth;
            }
            if (this->ball->position.y > this->fieldHeight) {
                this->ballVector.y = -abs(this->ballVector.y);
                this->ball->position.y -= this->ball->position.y - this->fieldHeight;
            } else if (this->ball->position.y < -this->fieldHeight) {
                this->ballVector.y = abs(this->ballVector.y);
                this->ball->position.y += -this->ball->position.y - this->fieldHeight;
            }
        }

        emscripten::val render(double delta)
        {
            this->tick(delta);

            this->ballBoundL = (this->ballBoundFactor * this->ball->position.x) + this->ballBoundX;
            this->ballBoundR = ballBoundL + this->ballBoundWidth;
            this->ballBoundB = ((int)(-this->ball->position.y * this->ballBoundFactor)) + this->ballBoundY;
            this->ballBoundT = ballBoundB + this->ballBoundWidth;

            for (int y = 0; y < this->height; y++) {
                for (int x = 0; x < this->width; x++) {
                    size_t bufferOffset = (x + y * this->width) * 4;
                    if (!(x >= this->ballBoundL && x <= this->ballBoundR && y <= this->ballBoundT && y >= this->ballBoundB)) {
                        this->buffer[bufferOffset + 0] = this->staticBuffer[bufferOffset + 0];
                        this->buffer[bufferOffset + 1] = this->staticBuffer[bufferOffset + 1];
                        this->buffer[bufferOffset + 2] = this->staticBuffer[bufferOffset + 2];
                        this->buffer[bufferOffset + 3] = 255;
                        continue;
                    }
                    ::ballHit = false;
                    Ray ray = this->camera->getRay(1.0 * x / (this->width - 1), 1.0 * y / (this->height - 1));
                    TraceResult result = this->rayTrace(ray);
                    //draw the pixel
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
            return this->miniTrace(ray, false);
        }

        TraceResult miniTrace(const Ray& ray, bool onlyShadowCasters) const
        {
            TraceResult finalResult;
            DisplayObject* closest = nullptr;
            double distance = 0;

            map<int, DisplayObject*>::const_iterator it;
            for (it = this->objects.begin(); it != this->objects.end(); it++) {
                DisplayObject* object = it->second;
                if (onlyShadowCasters && !object->getMaterial()->castShadows) continue;
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
            if (closest == this->ball) {
                ::ballHit = true;
            }
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
                surfaceProperties.reflectionDirection = reflectionDirection;
            }//*/

            // Calculate object color
            Color color;
            // Scene lights
            map<int, Light*>::iterator lightsIt;
            for (lightsIt = this->lights.begin(); lightsIt != this->lights.end(); lightsIt++) {
                Light* light = lightsIt->second;
                double intensity = light->getIntensity(traceResult, surfaceProperties, this);
                // Diffuse shading
                //if (object->getMaterial()->diffuse) {
                color.add(light->color * object->getMaterial()->getDiffuseColor(surfaceProperties) * intensity);
                //}
                // Specular component
                double spec = light->getSpecularIntensity(traceResult, surfaceProperties, this);
                if (spec > 0) {
                    color.add(light->color * (spec * intensity));
                }
            }

            // Ambient Occlusion
            if (object->getMaterial()->catchShadows && this->renderSettings.ambientOcclusion > 0 && depth < 3) {
                double ambientShade = 0;
                double ambDist = 5;
                for (int j = 0; j < this->renderSettings.ambientOcclusion; j++) {
                    Vector3 ambientDir = surfaceProperties.normal.randomize(1);
                    Ray ambientRay = Ray(intersection + (ambientDir * EPSILON), ambientDir);
                    TraceResult ambientResult = this->miniTrace(ambientRay, true);
                    if (ambientResult.object && ambientResult.distance > 0) {
                        if (ambientResult.distance <= ambDist) {
                            ambientShade += (ambDist - ambientResult.distance) / ambDist;
                        }
                    }
                }
                ambientShade = ambientShade / this->renderSettings.ambientOcclusion;
                double shade = (1.0 - ambientShade) * 0.8;
                color = color * (0.5 + shade * 0.5);
            }//*/

            // Reflection
            if (object->getMaterial()->reflection > 0 && depth <= this->renderSettings.maxRayDepth) {
                Ray reflectionRay = Ray(intersection + (reflectionDirection * EPSILON), reflectionDirection);
                TraceResult reflectionResult = this->rayTrace(reflectionRay, refractionIndex, depth + 1);
                Color reflectionColor = reflectionResult.color;
                color = (color * (1 - object->getMaterial()->reflection)) + (reflectionColor * object->getMaterial()->reflection);
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

            traceResult.color = color;
            return traceResult;
        }

    /******************************************************************************************************************/
    /** JavaScript Helper Methods *************************************************************************************/

        int addSphere(vct3 position, double radius);
        int addPlane(vct3 position, vct3 normal);
        int addTriangle(vrtx v1, vrtx v2, vrtx v3, bool renderBackSide, bool renderFlat);
        int addObj(int dataAddress, double scale, vct3 translation, vct3 rotation, bool renderBackside, bool renderFlat, bool invertNormals);

        int addAmbientLight(double intensity, vct3 color);
        int addPointLight(vct3 position, double intensity, double innerRadius, double outerRadius, vct3 color);

        int addMaterial(mtrl m);
        int addTexture(int data, const txtr& t);
        void setObjectMaterial(int objectIndex, int materialIndex);

};

#endif