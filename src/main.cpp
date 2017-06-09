#include <emscripten/bind.h>
#include "reetracer.h"
#define RAPIDJSON_HAS_STDSTRING = 1

EMSCRIPTEN_BINDINGS(hello) {
  emscripten::class_<ReeTracer>("ReeTracer")
      .constructor<std::string>() //constructor<int, int>()
      .function("render", &ReeTracer::render);
}