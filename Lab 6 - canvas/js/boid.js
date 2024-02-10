let i = 0;

class Boid {
    constructor() {
        this.pos = new Vector(WIDTH * Math.random(), HEIGHT * Math.random());
        this.vel = new Vector(Math.random() * 15 + 3, Math.random() * 15 + 3);
        this.acc = new Vector(0, 0);
        this.angle = Math.PI * 2 * Math.random();
        this.collisionRays = new Array(BOID_COLLISION_RAYS).fill(0).map((e, i) => { //TODO Last ray
            const percentage = i / BOID_COLLISION_RAYS;
            const startAngle = -(BOID_FOV / 2);

            return startAngle + (percentage * BOID_FOV);
        });
        this.points = [];
        this.separation = new Vector(0, 0);
        this.avoidance = new Vector(0, 0);
    }

    draw(ctx) {
        this._drawShape(ctx, this.pos.x + 5 + (3 * this.pos.x / WIDTH), this.pos.y + 5 + (3 * this.pos.y / HEIGHT), 1.8 + (0.2 * this.pos.y * this.pos.x / HEIGHT / WIDTH), 'rgba(0, 0, 0, 0.2)', false);
        this._drawShape(ctx, this.pos.x, this.pos.y, 1, '#888', true);

        // new Line(new Vector(this.pos.x, this.pos.y), this.avoidance.clone().multiply(200).add(this.pos)).draw(ctx);
        // if(i++ < 400) console.log(this.avoidance.clone().multiply(10));

        // const startAngle = ((2 * Math.PI) - (BOID_FOV / 2));
        // ctx.beginPath();
        // ctx.arc(this.pos.x, this.pos.y, BOID_VIEW_DISTANCE, this.angle + startAngle, this.angle + BOID_FOV + startAngle);
        // ctx.lineTo(this.pos.x, this.pos.y);
        // ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        // ctx.fill();

        // for(const angle of this.collisionRays) {
        //     const ray = new Line(this.pos.x, this.pos.y, this.pos.x + (Math.cos(angle + this.angle) * BOID_VIEW_DISTANCE), this.pos.y + (Math.sin(angle + this.angle) * BOID_VIEW_DISTANCE));
        //     ctx.beginPath();
        //     ctx.moveTo(ray.start.x, ray.start.y);
        //     ctx.lineTo(ray.end.x, ray.end.y);
        //     let intersects = false;

        //     for(const bound of BOUNDS) {
        //         if(bound.intersect(ray)) {
        //             intersects = true;
        //             break;
        //         }
        //     }
        //     for(const boid of boids) {
        //         if(boid == this || boid.points.filter(e => e == undefined).length != 0 || boid.points.length < 4) continue;

        //         if(ray.intersect(new Line(boid.points[0], boid.points[1])) || ray.intersect(new Line(boid.points[1], boid.points[2])) || ray.intersect(new Line(boid.points[2], boid.points[3])) || ray.intersect(new Line(boid.points[3], boid.points[0]))) {
        //             intersects = true;
        //             break;
        //         }
        //     }

        //     ctx.strokeStyle = intersects ? 'rgba(255, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.2)';
        //     ctx.lineWidth = 1;
        //     ctx.stroke();
        // }
    }

    _drawShape(ctx, x, y, scale, color, border) {
        this.points = [
            new Vector(x + (Math.cos(this.angle) * 1.5 * BOID_SIZE * scale), y + (Math.sin(this.angle) * 1.5 * BOID_SIZE * scale)),
            new Vector(x + (Math.cos(this.angle + (Math.PI * 0.81283333333)) * 1.803 * BOID_SIZE * scale), y + (Math.sin(this.angle + (Math.PI * 0.81283333333)) * 1.803 * BOID_SIZE * scale)),
            new Vector(x + (Math.cos(this.angle + Math.PI) * 0.5 * BOID_SIZE * scale), y + (Math.sin(this.angle + Math.PI) * 0.5 * BOID_SIZE * scale)),
            new Vector(x + (Math.cos(this.angle + (Math.PI * 1.1871666667)) * 1.803 * BOID_SIZE * scale), y + (Math.sin(this.angle + (Math.PI * 1.1871666667)) * 1.803 * BOID_SIZE * scale))
        ];

        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        ctx.lineTo(this.points[1].x, this.points[1].y);
        ctx.lineTo(this.points[2].x, this.points[2].y);
        ctx.lineTo(this.points[3].x, this.points[3].y);
        ctx.closePath();

        ctx.fillStyle = color;
        ctx.fill();
        if(!border) return;

        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 4;
        ctx.stroke();
    }

    move() {
        this.avoidance = this._getAvoidance();

        if(boids.indexOf(this) != 0) {
            this.separation = this._getSeparation();
            this.acc = this._getAlignment().add(this._getCohesion()).add(this.separation).add(this._getAvoidance());
            this.vel.add(this.acc).limit(BOID_MAX_SPEED);
        } else this.vel = new Vector(mp.x, mp.y).subtract(this.pos).divide(20);

        // if(this.vel.x + this.vel.y > 0.05) this.vel.add(new Vector(Math.random() / 5, Math.random() / 5));
        this.pos.add(this.vel);
        if(Math.abs(this.vel.x) + Math.abs(this.vel.y) > 1) this.angle = Math.atan2(this.vel.y, this.vel.x);
        this.pos.x = Math.abs(this.pos.x + WIDTH) % WIDTH;
        this.pos.y = Math.abs(this.pos.y + HEIGHT) % HEIGHT;
    }

    _getSeparation() {
        let total = 0;
        let avg = new Vector(0, 0);

        for(const b of boids) {
            if(b == this || b.pos.distance(this.pos) > BOID_VIEW_DISTANCE) continue; //TODO FOV

            avg.add(this.pos.clone().subtract(b.pos).divide(this.pos.distance(b.pos)));

            total++;
        }

        return avg.divide(total).setMagnitude(BOID_MAX_SPEED).subtract(this.vel).limit(BOID_MAX_SEPARATON_FORCE);
    }

    _getCohesion() {
        let total = 0;
        let avg = new Vector(0, 0);

        for(const b of boids) {
            if(b == this || b.pos.distance(this.pos) > BOID_VIEW_DISTANCE) continue; //TODO FOV

            avg.add(b.pos);
            total++;
        }

        return avg.divide(total).subtract(this.pos).setMagnitude(BOID_MAX_SPEED).subtract(this.vel).limit(BOID_MAX_COHESION_FORCE);
    }

    _getAlignment() {
        let total = 0;
        let avg = new Vector(0, 0);

        for(const b of boids) {
            if(b == this || b.pos.distance(this.pos) > BOID_VIEW_DISTANCE) continue; //TODO FOV

            avg.add(b.vel);
            total++;
        }

        return avg.divide(total).setMagnitude(BOID_MAX_SPEED).subtract(this.vel).limit(BOID_MAX_ALIGNMENT_FORCE);
    }

    // TODO Distance
    _getAvoidance() {
        let total = 0;
        let avg = new Vector(0, 0);

        for(const angle of this.collisionRays) {
            const ray = new Line(this.pos.x, this.pos.y, this.pos.x + (Math.cos(angle + this.angle) * BOID_VIEW_DISTANCE), this.pos.y + (Math.sin(angle + this.angle) * BOID_VIEW_DISTANCE));
            let intersects = false;

            for(const bound of BOUNDS) {
                if(bound.intersect(ray)) {
                    intersects = true;
                    break;
                }
            }

            if(!intersects) continue;

            // const deviation = Math.exp(-5 * Math.abs(angle / BOID_FOV));
            // console.log(angle, deviation);

            avg.add(new Vector(-Math.cos(this.angle + angle), -Math.sin(this.angle + angle)));//.multiply(deviation));
            total++;
        }

        if(avg.x == 0 && avg.y == 0) return new Vector(0, 0);

        return avg.divide(total).add(this.vel.clone().divide(BOID_MAX_SPEED)).setMagnitude(BOID_MAX_SPEED).limit(BOID_MAX_AVOIDANCE_FORCE);
    }
}