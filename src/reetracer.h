#ifndef REETRACER
#define REETRACER

class Scene;

#include "cameras/camera.h"
#include "primitives/displayobject.h"
#include "lights/light.h"
#include "rapidjson/document.h"
#include <iostream>

using namespace rapidjson;
using namespace std;

class ReeTracer
{
    protected:
        Scene* scene;
        Sphere* ball;
        Sphere* moon;
        double step;

    public:
        ReeTracer (string jsonSettings)
        {
            Document settings;
            if (settings.Parse(jsonSettings).HasParseError()) {
                cout << "PARSE ERROR";
            } else {
                cout << "PARSE SUCCESS";
            }
            return;
            int width = 5;
            int height = 5;
            this->scene = new Scene(width, height);

            Material* m = new Material(Color(1.0, 1.0, 0.0));
            Material* m2 = new Material(Color(0, 0, 1));

            Sphere* o1 = new Sphere(Vector3(0.0, 0.0, 10.0), 2.0);
            o1->setMaterial(m);
            this->scene->addObject(1, o1);

            this->ball = new Sphere(Vector3(-4.5, -3.0, 8.5), 1.0);
            this->ball->setMaterial(m2);
            this->scene->addObject(2, this->ball);

            Material* moonMaterial = new Material(Color(0.8, 0.8, 1.0));
            this->moon = new Sphere(Vector3(), 0.2);
            this->moon->setMaterial(moonMaterial);
            this->scene->addObject(3, this->moon);

            this->scene->addLight(1, new AmbientLight(0.3, Color(1.0, 1.0, 1.0)));
            this->scene->addLight(2, new PointLight(Vector3(-5.0, 10.0, -10.0), 0.7, 0, -1, Color(1.0, 1.0, 1.0)));

            this->step = 0;
        }

        emscripten::val render()
        {
            this->ball->position.x = cos(this->step) * 4;
            this->ball->position.z = 10 + sin(this->step) * 4;
            this->ball->position.y = sin(this->step+3) * 2;
            this->moon->position.x = this->ball->position.x + cos(-this->step * 2.2) * 1.5;
            this->moon->position.z = this->ball->position.z + sin(-this->step * 2.2) * 1.5;
            this->moon->position.y = this->ball->position.y;
            this->step +=0.04;
            return this->scene->render();
        }
};

#endif