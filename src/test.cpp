#define TEST

#include <stdio.h>
#include "scene/scene.h"

int main(int argc, char ** argv) {
    printf("Hello World\n");
    Scene scene = Scene(320, 240);
    scene.render();
    return 0;
}