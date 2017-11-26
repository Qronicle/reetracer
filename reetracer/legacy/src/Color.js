/**
 * @copyright   2016 Qronicle.be
 * @since       2016-12-03 18:26
 * @author      Ruud Seberechts
 */
class Color {
    constructor(r = 0, g = 0, b = 0) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    add(c) {
        if (c instanceof Color) return new Color(this.r + c.r, this.g + c.g, this.b + c.b);
        else return new Color(this.r + c, this.g + c, this.b + c);
    }

    subtract(c) {
        if (c instanceof Color) return new Color(this.r - c.r, this.g - c.g, this.b - c.b);
        else return new Color(this.r - c, this.g - c, this.b - c);
    }

    multiply(c) {
        if (c instanceof Color) return new Color(this.r * c.r, this.g * c.g, this.b * c.b);
        else return new Color(this.r * c, this.g * c, this.b * c);
    }

    clone() {
        return new Color(this.r, this.g, this.b);
    }

    init(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
        return this;
    }

    initRgb(r, g, b) {
        this.r = r / 255;
        this.g = g / 255;
        this.b = b / 255;
        return this;
    }

    getR() {
        return Math.max(0, Math.min(255, Math.round(this.r * 255)));
    }

    getG() {
        return Math.max(0, Math.min(255, Math.round(this.g * 255)));
    }

    getB() {
        return Math.max(0, Math.min(255, Math.round(this.b * 255)));
    }
}