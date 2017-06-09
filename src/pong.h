#include <emscripten/bind.h>
#include "ball.h"

class Pong {
    protected:
        int width, height;
        Ball* ball;
        uint8_t *buffer = nullptr;
        size_t bufferSize = 0;
    public:
        Pong(int width, int height) {
            this->width = width;
            this->height = height;
            this->ball = new Ball();
            this->ball->setPosition(0.0, 0.0);
            this->ball->setDirection(1.0, 1.0);
            this->bufferSize = this->width * this->height * 4;
            this->buffer = (uint8_t *)malloc(this->bufferSize);
        }
        emscripten::val render(double delta) {
            this->moveBall();
            // loop through every pixel
            int ballX = (int) this->ball->getX();
            int ballY = (int) this->ball->getY();
            for (int y = 0; y < this->height; y++)
            {
                for (int x = 0; x < this->width; x++)
                {
                        bool isBall = ballX == x && ballY == y;
                        //draw the pixel
                        size_t bufferOffset = (x + y * this->width) * 4;
                        this->buffer[bufferOffset + 0] = isBall ? 0 : 255;
                        this->buffer[bufferOffset + 1] = isBall ? 0 : 255;
                        this->buffer[bufferOffset + 2] = isBall ? 0 : 255;
                        this->buffer[bufferOffset + 3] = 255;
                }
            }

            return emscripten::val(emscripten::typed_memory_view(this->bufferSize, this->buffer));
        }
        void moveBall()
        {
            double x = this->ball->getX() + this->ball->getDirectionX();
            double y = this->ball->getY() + this->ball->getDirectionY();
            if (x < 0) {
                this->ball->invertX();
                x = -x;
            } else if (x >= this->width) {
                this->ball->invertX();
                x = this->width - (x - this->width);
            }
            if (y < 0) {
                this->ball->invertY();
                y = -y;
            } else if (y >= this->height) {
                this->ball->invertY();
                y = this->height - (y - this->height);
            }
            this->ball->setPosition(x, y);
        }
};