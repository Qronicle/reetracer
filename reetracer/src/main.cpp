#include <emscripten/bind.h>

class Scene;

#include "cameras/camera.h"
#include "primitives/displayobject.h"
#include "lights/light.h"
#include "scene/scene.h"
#include "lights/point.h"
#include "lights/ambient.h"

#include "scene/scene-import.h"
#include "material/texture.h"

EMSCRIPTEN_BINDINGS(saywut) {

    emscripten::value_array<vct3>("vct3")
        .element(&vct3::x)
        .element(&vct3::y)
        .element(&vct3::z);

    emscripten::value_object<mtrl>("mtrl")
        .field("diffuseColor", &mtrl::diffuseColor)
        .field("diffuseTexture", &mtrl::diffuseTexture)
        .field("normalMap", &mtrl::normalMap)
        .field("bumpMap", &mtrl::bumpMap)
        .field("castShadows", &mtrl::castShadows)
        .field("catchShadows", &mtrl::catchShadows)
        .field("reflection", &mtrl::reflection)
        .field("roughness", &mtrl::roughness)
        .field("specular", &mtrl::specular)
        .field("refraction", &mtrl::refraction)
        .field("refractionIndex", &mtrl::refractionIndex);

    emscripten::value_object<txtr>("txtr")
        .field("width", &txtr::width)
        .field("height", &txtr::height)
        .field("scale", &txtr::scale)
        .field("strength", &txtr::strength)
        .field("invertY", &txtr::invertY)
        .field("invertX", &txtr::invertX)
        .field("flipUV", &txtr::flipUV);

    emscripten::value_object<vrtx>("vrtx")
        .field("position", &vrtx::position)
        .field("normal", &vrtx::normal)
        .field("textureCoords", &vrtx::textureCoords);

    emscripten::value_object<RenderSettings>("RenderSettings")
        .field("width", &RenderSettings::width)
        .field("height", &RenderSettings::height)
        .field("numLightRays", &RenderSettings::numLightRays)
        .field("maxRayDepth", &RenderSettings::maxRayDepth)
        .field("ambientOcclusion", &RenderSettings::ambientOcclusion)
        .field("ambientColor", &RenderSettings::ambientColor);

    emscripten::class_<Scene>("Scene")
        .constructor<RenderSettings>()
        .function("render", &Scene::render)
        .function("addSphere", &Scene::addSphere)
        .function("addPlane", &Scene::addPlane)
        .function("addTriangle", &Scene::addTriangle)
        .function("addObj", &Scene::addObj)
        .function("addAmbientLight", &Scene::addAmbientLight)
        .function("addPointLight", &Scene::addPointLight)
        .function("addMaterial", &Scene::addMaterial)
        .function("addTexture", &Scene::addTexture)
        .function("setObjectMaterial", &Scene::setObjectMaterial);
}