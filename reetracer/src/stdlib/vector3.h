#ifndef VECTOR3
#define VECTOR3

#include <math.h>
#include <string>

struct vct3 {
    double x, y, z;
};

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

        Vector3 (vct3 vector)
        {
            this->x = vector.x;
            this->y = vector.y;
            this->z = vector.z;
        }

        void init (double x, double y, double z)
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

        Vector3 operator/(double v) const
        {
            return Vector3(this->x / v, this->y / v, this->z / v);
        }

        Vector3 operator-() const
        {
            return Vector3(-this->x, -this->y, -this->z);
        }

        double dot(const Vector3& v) const
        {
            return this->x * v.x + this->y * v.y + this->z * v.z;
        }
        
        Vector3 cross(const Vector3& v) const {
            return Vector3(
                this->y * v.z - this->z * v.y,
                this->z * v.x - this->x * v.z,
                this->x * v.y - this->y * v.x
            );
        }

        Vector3 unit() const
        {
            return *this / this->length();
        }

        void unitSelf()
        {
            double length = this->length();
            this->x /= length;
            this->y /= length;
            this->z /= length;
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

        Vector3 randomize(double factor) const
        {
            double factor2 = factor * 0.5;
            Vector3 vn = Vector3(
                ((double)rand()/(double)RAND_MAX) * factor - factor2,
                ((double)rand()/(double)RAND_MAX) * factor - factor2,
                ((double)rand()/(double)RAND_MAX) * factor - factor2
            );
            return (*this + vn).unit();
        }
        
        Vector3 mapToTangentSpace(Vector3 normal, Vector3 tangent, Vector3 bitangent) const
        {
            return Vector3(
                this->x * tangent.x + this->y * bitangent.x + this->z * normal.x,
                this->x * tangent.y + this->y * bitangent.y + this->z * normal.y,
                this->x * tangent.z + this->y * bitangent.z + this->z * normal.z
            );
            /*return new Vector3(
                this->x * normal.x + this->x * tangent.x + this->x * bitangent.x,
                this->y * normal.y + this->y * tangent.y + this->y * bitangent.y,
                this->z * normal.z + this->z * tangent.z + this->z * bitangent.z
            );*/
        }
    
        void rotate(Vector3 rotation) {
            if (rotation.x) {
                this->init(
                    this->x,
                    this->y * cos(rotation.x) - this->z * sin(rotation.x),
                    this->z * cos(rotation.x) + this->y * sin(rotation.x)
                );
            }
            if (rotation.y) {
                this->init(
                    this->x * cos(-rotation.y) - this->z * sin(-rotation.y),
                    this->y,
                    this->x * sin(-rotation.y) + this->z * cos(-rotation.y)
                );
            }
            if (rotation.z) {
                this->init(
                    this->x * cos(rotation.z) - this->y * sin(rotation.z),
                    this->x * sin(rotation.z) + this->y * cos(rotation.z),
                    this->z
                );
            }
        }

        std::string toString()
        {
            return "v3(x: " + std::to_string(this->x) + ", y: " + std::to_string(this->y) + ", z: " + std::to_string(this->z) + ")";
        }
};

class Vector2
{
    public:
        double x, y;

        Vector2 ()
        {
            this->x = 0.0;
            this->y = 0.0;
        }

        Vector2 (double x, double y)
        {
            this->x = x;
            this->y = y;
        }

        Vector2 (vct3 vector)
        {
            this->x = vector.x;
            this->y = vector.y;
        }
};

#endif