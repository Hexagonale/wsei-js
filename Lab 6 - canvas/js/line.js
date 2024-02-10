class Line {
    constructor(x1, y1, x2, y2) {
        if(x2 == undefined || y2 == undefined) {
            // consoles.log('aaa', x1, y1);
            this.start = x1;
            this.end = y1;
        } else {
            // console.log('bbb', x1, y1, x2, y2);
            this.start = new Vector(x1, y1);
            this.end  = new Vector(x2, y2);
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;
        ctx.stroke();

        return this;
    }

    intersect(line) {
        return this._ccw(this.start, this.end, line.start) != this._ccw(this.start, this.end, line.end) && this._ccw(line.start, line.end, this.start) != this._ccw(line.start, line.end, this.end);
    }

    _ccw(a, b, c) {
        return (b.x - c.x) * (a.y - c.y) > (a.x - c.x) * (b.y - c.y);
    }
}