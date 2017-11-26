#ifndef VERTEX
#define VERTEX

struct vrtx {
    vct3 position;
    vct3 normal;
    vct3 textureCoords;
    bool hasNormal;
    bool hasTextureCoords;
};

class Vertex
{
    public:
        Vector3 position;
        Vector3* normal;
        Vector2* textureCoords;

        Vertex(Vector3 position, Vector3* normal, Vector2* textureCoords)
        {
            this->position = position;
            this->normal = normal;
            this->textureCoords = textureCoords;
        }

        Vertex(const vrtx& v)
        {
            this->position = Vector3(v.position);
            if (v.hasNormal) {
                this->normal = new Vector3(v.normal);
            }
            if (v.hasTextureCoords) {
                this->textureCoords = new Vector2(v.textureCoords);
            }
        }
};

#endif