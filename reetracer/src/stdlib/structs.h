#ifndef STD_STRUCTS
#define STD_STRUCTS

#include "color.h"
#include <iostream>
#include "vector3.h"

using namespace std;

const double PI = 3.14159265358979323846;
const double PI2 = PI * 2;
const double EPSILON = 0.0000001;

const Vector3 VECTOR_UP = Vector3(0, 1, 0);
const Vector3 VECTOR_FORWARD = Vector3(0, 0, 1);
const Vector3 VECTOR_BACKWARD = Vector3(0, 0, -1);

const vector<string> explode(const string& s, const char& c)
{
	string buff{""};
	vector<string> v;

	for(auto n:s)
	{
		if(n != c) buff+=n; else
		if(n == c && buff != "") { v.push_back(buff); buff = ""; }
	}
	if(buff != "") v.push_back(buff);

	return v;
}

const vector<string> split(const string& s)
{
    string buff{""};
    vector<string> v;

    for(auto c:s)
    {
        if (c != ' ' && c != '\t' && (int)c != 13) {
            buff += c;
        } else {
            if(buff != "") v.push_back(buff);
            buff = "";
        }
    }
    if(buff != "") {
        v.push_back(buff);
    }

    return v;
}

struct SurfaceProperties {
    Vector3 intersection;
    Vector3 normal;
    Vector3 reflectionDirection;
    double u;
    double v;
};

struct TraceResult {
    bool hit = false;
    double distance;
    bool inside = false;
    DisplayObject* object = nullptr;
    Triangle* triangle = nullptr;
    Color color;
    double u;
    double v;
};

#endif