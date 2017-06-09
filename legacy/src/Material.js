/**
 * @copyright   2016 Qronicle.be
 * @since       2016-12-03 18:31
 * @author      Ruud Seberechts
 */
class Material {
    constructor(diffuse = new Color()) {
        this.diffuse = diffuse;
        this.reflection = 0;
        this.roughness = 0;
        this.specular = 0;
        this.refraction = 0;
        this.refractionIndex = 1;
        this.texture = null;
        this.bump = null; // Bump map
        this.normal = null; // Normal map
    }

    getDiffuseColor(surfaceProperties) {
        return this.getPropertyColor(this.diffuse, surfaceProperties);
    }

    getPropertyColor(texture, surfaceProperties) {
        if (texture instanceof Color) {
            return texture;
        }
        if (texture instanceof Texture) {
            var u = surfaceProperties.u * texture.scale;
            if (u < 0 || u > 1) u = u % 1;
            if (u < 0) u += 1;
            var v = surfaceProperties.v * texture.scale;
            if (v < 0 || v > 1) v = v % 1;
            if (v < 0) v += 1;
            if (texture.flipUV) {
                var tmp = v;
                v = u;
                u = tmp;
            }

            /*/ Nearest neighbour
            var x = Math.round(u * (texture.width-1));
            var y = Math.round(v * (texture.height-1));
            return texture.getColorAt(x, y); //*/

            // Bilinear filtering
            var x = u * (texture.width-1) + texture.width - 0.5;
            var y = v * (texture.height-1) + texture.height - 0.5;
            var x1 = Math.floor(x) % texture.width;
            var y1 = Math.floor(y) % texture.height;
            var x2 = (x1 + 1) % texture.width;
            var y2 = (y1 + 1) % texture.height;
            // calculate fractional parts of u and v
            var fracu = (x == 0 ? 1 : x) - Math.floor(x);
            var fracv = (y == 0 ? 1 : y) - Math.floor(y);
            // calculate weight factors
            var w1 = (1 - fracu) * (1 - fracv);
            var w2 = fracu * (1 - fracv);
            var w3 = (1 - fracu) * fracv;
            var w4 = fracu * fracv;
            // fetch four texels

            var c1 = texture.getColorAt(x1, y1);
            var c2 = texture.getColorAt(x2, y1);
            var c3 = texture.getColorAt(x1, y2);
            var c4 = texture.getColorAt(x2, y2);
            // scale and sum the four colors
            return c1.multiply(w1)
                .add(c2.multiply(w2))
                .add(c3.multiply(w3))
                .add(c4.multiply(w4));
        }
    }

    getNormalOffset(u, v) {
        if (this.bump instanceof Texture) {
            var c = this.getPropertyColor(this.bump, {u: u-0.01, v: v-0.01});
            var cx = this.getPropertyColor(this.bump, {u: u+0.01, v: v-0.01});
            var cy = this.getPropertyColor(this.bump, {u: u-0.01, v: v+0.01});
            // Calculate offsets
            var xOffset = c.r - cx.r;
            var yOffset = c.r - cy.r;
            var v3 = new Vector3(xOffset * this.bump.strength, yOffset * this.bump.strength, 1);
            return v3.unit();
        }
        if (this.normal instanceof Texture) {
            /*var n = new Vector3(Math.random() * 0.2, Math.random() * 0.2, 1);
            return n.unit();*/
            var c = this.getPropertyColor(this.normal, {u: u, v: v});
            var mX = this.normal.invertX ? -1 : 1;
            var mY = this.normal.invertY ? 1 : -1;
            if (this.normal.flipUV) {
                v = new Vector3(-mX * (c.g - 0.5), -mY * (c.r - 0.5), c.b - 0.5);
            } else {
                // default
                v = new Vector3(mX * (c.r - 0.5), mY * (c.g - 0.5), c.b - 0.5);
            }
            return v.unit();
        }
        /*/ Roughness
        if (object.material.roughness) {
            var d = object.material.roughness;
            var d2 = d * 0.5;
            var vn = new Vector3(
                Math.random() * d - d2,
                Math.random() * d - d2,
                Math.random() * d - d2
            );
            normal = normal.add(vn).unit();
        }//*/
        return false;
    }
}
