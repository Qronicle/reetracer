#include <emscripten/bind.h>

class Scene;

#include "../../reetracer/src/cameras/camera.h"
#include "../../reetracer/src/primitives/displayobject.h"
#include "../../reetracer/src/lights/light.h"
#include "scene/scene.h"
#include "../../reetracer/src/lights/point.h"
#include "../../reetracer/src/lights/ambient.h"

#include "../../reetracer/src/scene/scene-import.h"
#include "../../reetracer/src/material/texture.h"

void Scene::init (int bgTextureAddress, int bgTextureWidth, int bgTextureHeight)
{
    // Initialize background texture
    uint8_t* imageData = reinterpret_cast<uint8_t*>(bgTextureAddress);
    txtr t{};
    t.width = bgTextureWidth;
    t.height = bgTextureHeight;
    t.scale = 0.3;
    Texture* texture = new Texture(imageData, t);
    this->textures[this->textureIndex] = texture;

    // Add lights
    AmbientLight* ambientLight = new AmbientLight(0.2, Color(1,1,1));
    this->lights[0] = ambientLight;
    PointLight* p1 = new PointLight(Vector3(-4, 0, 5), 0.5, 5.0, 10.0, Color(1,1,1));
    this->lights[1] = p1;
    PointLight* p2 = new PointLight(Vector3(4, 0, 5), 0.5, 5.0, 10.0, Color(1,1,1));
    this->lights[2] = p2;

    // Add ball
    this->ball = new Sphere(Vector3(0, 0, 10), .4);
    Material* ballMaterial = new Material(Color(1, 0, 0));
    ballMaterial->roughness = 0.1;
    ballMaterial->specular = 1;
    ballMaterial->catchShadows = true;
    this->ball->setMaterial(ballMaterial);

    // Add player 1 (left)
    this->player1 = new Sphere(Vector3(-12, 0, 10), 5.0);
    Material* playerMaterial = new Material(Color(0.2, 0.2, 0.2));
    this->player1->setMaterial(playerMaterial);
    this->objects[1] = this->player1;

    // Add player 2 (right)
    this->player2 = new Sphere(Vector3(12, 0, 10), 5.0);
    this->player2->setMaterial(playerMaterial);
    this->objects[2] = this->player2;

    // Add field
    this->bg = new Plane(Vector3(0, 0, 10.4), Vector3(0, 0, -1));
    Material* bgMaterial = new Material(Color(0,0,0));
    bgMaterial->diffuseTexture = texture;
    bg->setMaterial(bgMaterial);
    this->objects[3] = this->bg;

    this->renderStaticContent();
    this->objects[0] = this->ball;
}

EMSCRIPTEN_BINDINGS(saywut) {

    emscripten::value_array<vct3>("vct3")
        .element(&vct3::x)
        .element(&vct3::y)
        .element(&vct3::z);

    emscripten::value_object<RenderSettings>("RenderSettings")
        .field("width", &RenderSettings::width)
        .field("height", &RenderSettings::height)
        .field("numLightRays", &RenderSettings::numLightRays)
        .field("maxRayDepth", &RenderSettings::maxRayDepth)
        .field("ambientOcclusion", &RenderSettings::ambientOcclusion)
        .field("ambientColor", &RenderSettings::ambientColor);

    emscripten::class_<Scene>("Scene")
        .constructor<RenderSettings, int,  int, int>()
        .function("render", &Scene::render);
}