@echo off
DEL bin\reetracer.lib.js

set files=Math2 Vector3 Vertex Ray Color Material Texture AbstractDisplayObject Plane Sphere Triangle Polygon Mesh AbstractLight AmbientLight PointLight Camera Scene ObjImporter SceneImporter ReeTracer

(for %%a in (%files%) do (
   TYPE "src\%%a.js" >> bin\reetracer.lib.js
))

