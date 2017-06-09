#ifndef VECTOR3
#define VECTOR3

#include <math.h>
#include <string>

class Vector3
{
    public:
        double x, y, z;

        Vector3 ()
        {
            this->x = 0.0;
            this->y = 0.0;
            this->z = 0.0;
        }

        Vector3 (double x, double y, double z)
        {
            this->x = x;
            this->y = y;
            this->z = z;
        }

        Vector3 operator+(const Vector3& vector) const
        {
            return Vector3(this->x + vector.x, this->y + vector.y, this->z + vector.z);
        }

        Vector3 operator-(const Vector3& vector) const
        {
            return Vector3(this->x - vector.x, this->y - vector.y, this->z - vector.z);
        }

        Vector3 operator*(double v) const
        {
            return Vector3(this->x * v, this->y * v, this->z * v);
        }

        const Vector3 operator/(double v) const
        {
            return Vector3(this->x / v, this->y / v, this->z / v);
        }

        double dot(const Vector3& v) const
        {
            return this->x * v.x + this->y * v.y + this->z * v.z;
        }

        Vector3 unit() const
        {
            return *this / this->length();
        }

        double length() const
        {
            return sqrt(this->dot(*this));
        }

        double distanceTo(const Vector3& v) const
        {
            return sqrt(this->squareDistanceTo(v));
        }

        double squareDistanceTo(const Vector3& v) const
        {
            return pow(this->x - v.x, 2) + pow(this->y - v.y, 2) + pow(this->z - v.z, 2);
        }

        Vector3 randomize(double factor)
        {
            double factor2 = factor * 0.5;
            Vector3 vn = Vector3(
                ((double)rand()/(double)RAND_MAX) * factor - factor2,
                ((double)rand()/(double)RAND_MAX) * factor - factor2,
                ((double)rand()/(double)RAND_MAX) * factor - factor2
            );
            return (*this + vn).unit();
        }

        std::string toString()
        {
            return "v3(x: " + std::to_string(this->x) + ", y: " + std::to_string(this->y) + ", z: " + std::to_string(this->z) + ")";
        }
};

#endif