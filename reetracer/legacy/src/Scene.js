class Scene {
    constructor(renderSettings) {
        this.renderSettings = renderSettings;
        console.log(renderSettings);
        this.ambientColor = new Color(0, 0, 0);
        if (this.renderSettings.ambientColor) {
            this.ambientColor.initRgb(
                this.renderSettings.ambientColor[0],
                this.renderSettings.ambientColor[1],
                this.renderSettings.ambientColor[2]
            );
        }
        this.maxRayDepth =  this.renderSettings.maxRayDepth || 3;
        this.objects = [];
        this.lights = [];
        this.numLightRays = this.renderSettings.numLightRays || 1;
        /*this.lights = [
            new PointLight(new Vector3(3, 20, -8), 1),
            //new PointLight(new Vector3(0, 4, 0))
        ];*/
        this.camera = new Camera(new Vector3(), renderSettings.width / renderSettings.height * 3, 3, 4);
    }

    miniTrace(ray) {
        var closest = false;
        var distance = null;
        var insideDisplayObject = null;
        var finalTraceResult = null;
        for (var i in this.objects) {
            var object = this.objects[i];
            var traceResult = object.intersect(ray);
            if (traceResult !== false && traceResult.distance > 0.00001) {
                if (!closest || traceResult.distance < distance) {
                    closest = object;
                    distance = traceResult.distance;
                    insideDisplayObject = traceResult.inside;
                    finalTraceResult = traceResult;
                }
            }
        }
        if (!closest) {
            return {
                displayObject: null,
                distance: distance,
                color: this.ambientColor
            };
        }
        finalTraceResult.displayObject = closest;
        return finalTraceResult;
    }

    rayTrace(ray, refractionIndex = 1, depth = 0) {
        // Find closest object
        var hit = this.miniTrace(ray);
        if (!hit.displayObject) return hit;
        var object = hit.displayObject;
        // Calculation point of intersection and normal
        hit.intersection = ray.origin.add(ray.direction.multiply(hit.distance));
        hit.surfaceProperties = object.getSurfaceProperties(hit.intersection, hit);
        hit.normal = hit.surfaceProperties.normal;
        // Reflection ray
        var reflectionDirection = new Vector3();
        if (object.material.reflection > 0 || object.material.specular > 0) {
            reflectionDirection = ray.direction.subtract(hit.normal.multiply(ray.direction.dot(hit.normal) * 2));
        }//*/
        // Calculate object color
        var color = new Color();
        // Scene lights
        for (var i in this.lights) {
            // Lighting
            var light = this.lights[i]; //p
            var intensity = light.getIntensity(hit, this);
            // calculate diffuse shading
            if (object.material.diffuse) {
                color = color.add(light.color.multiply(object.material.getDiffuseColor(hit.surfaceProperties)).multiply(intensity));
            }//*/
            // determine specular component
            if (object.material.specular > 0 && light instanceof PointLight) {
                // point light source: sample once for specular highlight
                var direction = light.position.subtract(hit.intersection).unit();
                var dot = direction.dot(reflectionDirection);
                if (dot > 0) {
                    var spec = Math.pow(dot, 20) * object.material.specular * intensity;
                    // add specular component to ray color
                    color = color.add(light.color.multiply(spec)); //light.color.multiply(object.material.color).multiply(diff));
                }
            }//*/
        }
        // Ambient Occlusion
        if (this.renderSettings.ambientOcclusion) {
            var ambientShade = 0;
            var ambDist = 5;
            for (let j = 0; j < this.renderSettings.ambientOcclusion; j++) {
                var ambientDir = hit.normal.randomize(1);
                var ambientRay = new Ray(hit.intersection.add(ambientDir.multiply(0.0000001)), ambientDir);
                var ambientResult = this.miniTrace(ambientRay);
                if (ambientResult.displayObject && ambientResult.distance > 0) {
                    if (ambientResult.distance <= ambDist) {
                        ambientShade += (ambDist - ambientResult.distance) / ambDist;
                    }
                }
            }
            ambientShade = ambientShade / this.renderSettings.ambientOcclusion;
            const shade = (1 - ambientShade) * 0.8;
            color = color.multiply(0.5 + shade * 0.5);
        }//*/
        // Reflection
        if (object.material.reflection > 0 && depth < this.maxRayDepth) {
            var reflectionRay = new Ray(hit.intersection.add(reflectionDirection.multiply(Math2.EPSILON)), reflectionDirection);
            var reflectionResult = this.rayTrace(reflectionRay, refractionIndex, depth + 1);
            var reflectionColor = reflectionResult.color;
            color = color.multiply(1 - object.material.reflection).add(reflectionColor.multiply(object.material.reflection));
            //color = color.add(object.material.color.multiply(reflectionColor.multiply(object.material.reflection)));
        }//*/
        /*/ Refraction
         if (object.material.refraction > 0 && depth < this.maxRayDepth) {
         var n = refractionIndex / object.material.refractionIndex;
         var refractionNormal = normal;
         if (insideDisplayObject) {
         refractionNormal = refractionNormal.negative();
         }
         var cosI = -refractionNormal.dot(ray.direction);
         var cosT2 = 1 - n * n * (1 - cosI * cosI);
         if (cosT2 > 0) {
         var t = ray.direction.multiply(n).add(refractionNormal.multiply(n * cosI - Math.sqrt(cosT2)));
         var refractionRay = new Ray(intersection.add(t.multiply(0.0000001)), t);
         var refractionResult = this.rayTrace(refractionRay, object.material.refractionIndex, depth + 1);
         // apply Beer's law
         var refractionHitDistance = refractionResult ? refractionResult.distance : 1000000;
         var absorbance = object.material.color.multiply(0.15 * -refractionHitDistance);
         var transparency = new Color(Math.exp(absorbance.r), Math.exp(absorbance.g), Math.exp(absorbance.b));
         color = color.add(refractionResult.color.multiply(transparency));
         //
         }
         }//*/
        /*/ Dust
         if (Math.random() > 0.2 && depth == 0 && distance > 0 && distance < 20) {
         var dustPositions = [];
         for (i = 0; i < Math.ceil(distance); i++) {
         var dd = Math.random() + i;
         if (dd < distance) {
         dustPositions.push(ray.origin.add(ray.direction.multiply(dd)));
         }
         }
         if (dustPositions.length) {
         shade = 0;
         var m = 1 / this.lights.length;
         for (var dp in dustPositions) {
         for (i in this.lights) {
         // Lighting
         light = this.lights[i]; //p
         direction = light.position.subtract(dustPositions[dp]).unit();
         shadowRay = new Ray(dustPositions[dp], direction);
         shadowResult = this.miniTrace(shadowRay);
         if (shadowResult.displayObject && shadowResult.distance > 0 && Math.pow(shadowResult.distance, 2) < dustPositions[dp].squareDistanceTo(light.position)) {
         //shade += 0.5 * m;
         } else {
         shade += m;
         }
         }
         }
         shade /= dustPositions.length;
         color = color.multiply(shade);
         }
         }//*/
        return {
            displayObject: object,
            distance: hit.distance,
            color: color
        };
    }
}
