using namespace std;

int Scene::addSphere(vct3 position, double radius) {
    Sphere* object = new Sphere(Vector3(position), radius);
    this->objects[this->objectIndex] = object;
    return this->objectIndex++;
}

int Scene::addPlane(vct3 position, vct3 normal) {
    Plane* object = new Plane(Vector3(position), Vector3(normal));
    this->objects[this->objectIndex] = object;
    return this->objectIndex++;
}

int Scene::addTriangle(vrtx v1, vrtx v2, vrtx v3, bool renderBackSide, bool renderFlat) {
    Triangle* object = new Triangle(Vertex(v1), Vertex(v2), Vertex(v3), renderBackSide, renderFlat);
    this->objects[this->objectIndex] = object;
    return this->objectIndex++;
}

int Scene::addObj(int dataAddress, double scale, vct3 translationVct, vct3 rotationVct, bool renderBackside, bool renderFlat, bool invertNormals)
{
    // Get object description from memory
    char* data = reinterpret_cast<char *>(dataAddress);
    string content = string(data);
    vector<string> lines = explode(content, '\n');

    // Initialize all them things
    vector<Vector3> vertexPositions{};
    vector<Vector2*> textureCoords{};
    vector<Vector3*> vertexNormals{};
    vector<Triangle*> triangles{};
    bool translate = translationVct.x != 0 || translationVct.y != 0 || translationVct.z != 0;
    bool rotate = rotationVct.x != 0 || rotationVct.y != 0 || rotationVct.z != 0;
    Vector3 translation = Vector3(translationVct);
    Vector3 rotation = Vector3(rotationVct);

    for(auto line:lines) {
        // Check whether we want to parse this line
        if (!line.length()) continue;
        if (line[0] == '#') continue;
        vector<string> parts = split(line);
        if (!parts.size()) continue;

        // Add vertex
        if (parts[0] == "v") {
            Vector3 v = Vector3(stof(parts[1]), stof(parts[2]), stof(parts[3]));
            // Apply rotation
            if (rotate) {
                v.rotate(rotation);
            }
            // Apply scale
            if (scale != 1) {
                v = v * scale;
            }
            // Apply translation
            if (translate) {
                v =  v + translation;
            }
            vertexPositions.push_back(v);
            continue;
        }

        // Add vertex texture coordinate
        if (parts[0] == "vt") {
            textureCoords.push_back(new Vector2(stof(parts[1]), stof(parts[2])));
            continue;
        }

        // Add vertex normal
        if (parts[0] == "vn") {
            Vector3* normal = new Vector3(stof(parts[1]), stof(parts[2]), stof(parts[3]));
            // Apply rotation
            if (rotate) {
                normal->rotate(rotation);
            }
            normal->unitSelf();
            vertexNormals.push_back(normal);
            continue;
        }

        // Add polygons (as triangles)
        if (parts[0] == "f") {
            vector<Vertex> vertices{};
            bool hasNormalInfo = false;
            for (int i = 1; i < parts.size(); i++) {
                vector<string> faceData = explode(parts[i], '/');
                int vIndex = stoi(faceData[0]);
                int tIndex = faceData.size() > 1 ? stoi(faceData[1]) : 0;
                int nIndex = faceData.size() > 2 ? stoi(faceData[2]) : 0;
                if (vIndex < 0) vIndex = vertexPositions.size() + 1 + vIndex;
                if (nIndex < 0) nIndex = vertexNormals.size() + 1 + nIndex;
                if (tIndex < 0) tIndex = textureCoords.size() + 1 + tIndex;
                vertices.push_back(Vertex(
                    vertexPositions[vIndex-1],
                    faceData.size() > 2 ? vertexNormals[nIndex-1] : 0,
                    faceData.size() > 1 ? textureCoords[tIndex-1] : 0
                ));
            }
            /*/ Polygon vs Triangle switcher
            this.polygons.push(new Polygon(v, this.renderBackside, this.renderFlat));
            /*/
            for (int vi = 2; vi < vertices.size(); vi++) {
                triangles.push_back(
                    new Triangle(
                        vertices[0],
                        vertices[invertNormals ? vi - 1 : vi],
                        vertices[invertNormals ? vi : vi - 1],
                        renderBackside,
                        renderFlat
                    )
                );
            }
            //*/
            continue;
        }
    }
    std::cout << "   > Imported triangles: " << triangles.size() << "\n";
    Mesh* object = new Mesh(triangles);
    this->objects[this->objectIndex] = object;
    return this->objectIndex++;
}

int Scene::addAmbientLight(double intensity, vct3 color) {
    AmbientLight* light = new AmbientLight(intensity, Color(color));
    this->lights[this->lightIndex] = light;
    return this->lightIndex++;
}

int Scene::addPointLight(vct3 position, double intensity, double innerRadius, double outerRadius, vct3 color) {
    PointLight* light = new PointLight(Vector3(position), intensity, innerRadius, outerRadius, Color(color));
    this->lights[this->lightIndex] = light;
    return this->lightIndex++;
}

int Scene::addMaterial(mtrl m) {
    Material* material = new Material(m);
    if (m.diffuseTexture >= 0) {
        material->diffuseTexture = this->textures[m.diffuseTexture];
    }
    if (m.normalMap >= 0) {
        material->normalMap = this->textures[m.normalMap];
    }
    if (m.bumpMap >= 0) {
        material->bumpMap = this->textures[m.bumpMap];
    }
    this->materials[this->materialIndex] = material;
    return this->materialIndex++;
}

int Scene::addTexture(int data, const txtr& t) {
    uint8_t* imageData = reinterpret_cast<uint8_t*>(data);
    Texture* texture = new Texture(imageData, t);
    this->textures[this->textureIndex] = texture;
    return this->textureIndex++;
}

void Scene::setObjectMaterial(int objectIndex, int materialIndex) {
    this->objects[objectIndex]->setMaterial(this->materials[materialIndex]);
}