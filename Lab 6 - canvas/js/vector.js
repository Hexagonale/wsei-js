class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;

        return this;
    }

    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;

        return this;
    }

    multiply(m) {
        this.x *= m;
        this.y *= m;

        return this;
    }

    divide(d) {
        if(d == 0) return this;

        this.x /= d;
        this.y /= d;

        return this;
    }

    limit(l) {
        this.x = Math.max(Math.min(l, this.x), -l);
        this.y = Math.max(Math.min(l, this.y), -l);

        return this;
    }

    setMagnitude(m) {
        const mag = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));

        if(mag == 0) {    
            this.x = 0;
            this.y = 0;

            return this;
        }

        this.x = this.x * m / mag;
        this.y = this.y * m / mag;

        return this;
    }

    abs() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);

        return this;
    }

    distance(vector) {
        return Math.sqrt(Math.pow(this.x - vector.x, 2) + Math.pow(this.y - vector.y, 2));
    }

    clone() {
        return new Vector(this.x, this.y);
    }
}