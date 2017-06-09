/**
 * @copyright   2016 Qronicle.be
 * @since       2016-12-06 21:36
 * @author      Ruud Seberechts
 */
class PointLight extends AbstractLight {
    constructor(position = new Vector3(), intensity = 1, innerRadius = 0, outerRadius = -1, color = new Color(1, 1, 1)) {
        super(intensity, color);
        this.position = position;
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.radiusDiff = this.outerRadius - this.innerRadius;
    }

    getIntensity(hit, scene) {
        var shade = 0;
        // Lighting
        var direction = this.position.subtract(hit.intersection).unit();

        var dot = hit.normal.dot(direction);
        if (dot > 0) {
            var intensity = this.intensity;
            if (this.outerRadius >= 0) {
                var distToLight = hit.intersection.distanceTo(this.position);
                if (distToLight >= this.outerRadius) {
                    intensity = 0;
                } else if (distToLight > this.innerRadius) {
                    intensity = (1 - ((distToLight - this.innerRadius) / this.radiusDiff)) * intensity;
                }
            }
            dot *= intensity;
        }
        if (dot <= 0) return 0;

        var nDirection = direction.clone();
        for (var j = 0; j < scene.numLightRays; j++) {
            var shadowRay = new Ray(hit.intersection.add(nDirection.multiply(0.0000001)), nDirection);
            var shadowResult = scene.miniTrace(shadowRay);
            if (shadowResult.displayObject && shadowResult.distance > 0 && Math.pow(shadowResult.distance, 2) < hit.intersection.squareDistanceTo(this.position)) {
                //shades.push(0);
                if (shadowResult.inside) {
                    shade += 1;
                }
            } else {
                shade += 1;
            }
            nDirection = direction.randomize(0.01);
        }
        shade = shade / scene.numLightRays;
        return dot * shade;
    }
}