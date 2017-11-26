#ifndef COLOR
#define COLOR

#include <math.h>
#include <string>
#include <algorithm>

using namespace std;

class Color
{
    public:
        double r, g, b;

        Color ()
        {
            this->r = 0.0;
            this->g = 0.0;
            this->b = 0.0;
        }

        Color (double r, double g, double b)
        {
            this->r = r;
            this->g = g;
            this->b = b;
        }

        Color (vct3 color) {
            this->r = color.x / 255;
            this->g = color.y / 255;
            this->b = color.z / 255;
        }

        Color operator+(const Color& color)
        {
            return Color(this->r + color.r, this->g + color.g, this->b + color.b);
        }

        Color operator-(const Color& color)
        {
            return Color(this->r - color.r, this->g - color.g, this->b - color.b);
        }
        const Color operator-(const Color& color) const
        {
            return Color(this->r - color.r, this->g - color.g, this->b - color.b);
        }

        Color operator*(const Color& color) const
        {
            return Color(this->r * color.r, this->g * color.g, this->b * color.b);
        }

        Color operator*(double color) const
        {
            return Color(this->r * color, this->g * color, this->b * color);
        }

        Color operator/(double v)
        {
            return Color(this->r / v, this->g / v, this->b / v);
        }

        void add(const Color& color)
        {
            this->r += color.r;
            this->g += color.g;
            this->b += color.b;
        }

        int getRed()
        {
            return min(255, max(0, (int) (0.5 + this->r * 255)));
        }

        int getGreen()
        {
            return min(255, max(0, (int) (0.5 + this->g * 255)));
        }

        int getBlue()
        {
            return min(255, max(0, (int) (0.5 + this->b * 255)));
        }

        std::string toString()
        {
            return "color(r: " + std::to_string(this->r) + ", g: " + std::to_string(this->g) + ", b: " + std::to_string(this->b) + ")";
        }
};

#endif