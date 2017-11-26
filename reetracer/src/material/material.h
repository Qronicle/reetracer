#ifndef MATERIAL
#define MATERIAL

#include <string>
#include "../stdlib/structs.h"
#include "texture.h"

struct mtrl {
    vct3 diffuseColor;
    int diffuseTexture;
    int normalMap;
    int bumpMap;
    double reflection = 0;
    double roughness = 0;
    double specular = 0;
    double refraction = 0;
    double refractionIndex = 1;
    bool castShadows;
    bool catchShadows;
};

class Material
{
    protected:

        /*double texture = null;
        double bump = null; // Bump map
        double normal = null; // Normal map*/

    public:
            Color diffuseColor;
            Texture* diffuseTexture = nullptr;
            Texture* normalMap = nullptr;
            Texture* bumpMap = nullptr;
            double reflection = 0;
            double roughness = 0;
            double specular = 0;
            double refraction = 0;
            double refractionIndex = 1;
            bool castShadows = true;
            bool catchShadows = true;

        double r, g, b;

        Material (const Color& diffuse)
        {
            this->diffuseColor = diffuse;
        }

        Material (const mtrl& material)
        {
            this->diffuseColor    = Color(material.diffuseColor);
            this->reflection      = material.reflection;
            this->roughness       = material.roughness;
            this->specular        = material.specular;
            this->refraction      = material.refraction;
            this->refractionIndex = material.refractionIndex;
            this->castShadows     = material.castShadows;
            this->catchShadows    = material.catchShadows;
        }

        Color getDiffuseColor(SurfaceProperties surfaceProperties)
        {
            return this->getPropertyColor(this->diffuseColor, this->diffuseTexture, surfaceProperties.u, surfaceProperties.v);
        }

        Color getPropertyColor(const Color& color, Texture* texture, double u, double v)
        {
            if (texture == 0) {
                return color;
            }
            return this->getPropertyColor(texture, u, v);
        }

        Color getPropertyColor(Texture* texture, double u, double v)
        {
            u = u * texture->scale;
            if (u < 0 || u > 1) u = fmod(u, 1);
            if (u < 0) u += 1;
            v = v * texture->scale;
            if (v < 0 || v > 1) v = fmod(v, 1);
            if (v < 0) v += 1;
            if (texture->flipUV) {
                double tmp = v;
                v = u;
                u = tmp;
            }

            /*/ Nearest neighbour
            int x = round(u * (texture->width-1));
            int y = round(v * (texture->height-1));
            return texture->getColorAt(x, y); //*/

            // Bilinear filtering
            double x = u * (texture->width-1) + texture->width - 0.5;
            double y = v * (texture->height-1) + texture->height - 0.5;
            int x1 = (int)x % texture->width;
            int y1 = (int)y % texture->height;
            int x2 = (x1 + 1) % texture->width;
            int y2 = (y1 + 1) % texture->height;
            // calculate fractional parts of u and v
            double fracu = (x == 0 ? 1.0 : x) - floor(x);
            double fracv = (y == 0 ? 1.0 : y) - floor(y);
            // calculate weight factors
            double w1 = (1.0 - fracu) * (1.0 - fracv);
            double w2 = fracu * (1.0 - fracv);
            double w3 = (1.0 - fracu) * fracv;
            double w4 = fracu * fracv;
            // fetch four texels
            Color c1 = texture->getColorAt(x1, y1);
            Color c2 = texture->getColorAt(x2, y1);
            Color c3 = texture->getColorAt(x1, y2);
            Color c4 = texture->getColorAt(x2, y2);
            // scale and sum the four colors
            return (c1 * w1) + (c2 * w2) + (c3 * w3) + (c4 * w4);
        }

        bool hasNormalOffset()
        {
            return this->normalMap != 0 || this->bumpMap != 0 || this->roughness != 0;
        }

        Vector3 getNormalOffset(double u, double v)
        {
            if (this->normalMap != 0) {
                Color c = this->getPropertyColor(this->normalMap, u, v);
                double mX = this->normalMap->invertX ? -1 : 1;
                double mY = this->normalMap->invertY ? 1 : -1;
                Vector3 v;
                if (this->normalMap->flipUV) {
                    v = Vector3(-mX * (c.g - 0.5), -mY * (c.r - 0.5), c.b - 0.5);
                } else {
                    // default
                    v = Vector3(mX * (c.r - 0.5), mY * (c.g - 0.5), c.b - 0.5);
                }
                return v.unit();
            }
            if (this->bumpMap != 0) {
                Color c = this->getPropertyColor(this->bumpMap, u-0.01, v-0.01);
                Color cx = this->getPropertyColor(this->bumpMap, u+0.01, v-0.01);
                Color cy = this->getPropertyColor(this->bumpMap, u-0.01, v+0.01);
                // Calculate offsets
                double xOffset = c.r - cx.r;
                double yOffset = c.r - cy.r;
                Vector3 v3 = Vector3(xOffset * this->bumpMap->strength, yOffset * this->bumpMap->strength, 1);
                return v3.unit();
            }
            return VECTOR_FORWARD.randomize(this->roughness);
        }

        std::string toString()
        {
            return "[Material]";
        }
};

#endif