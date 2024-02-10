const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const POPULATION_SIZE = 100;
const BOID_SIZE = 3;
const BOID_FOV = 3/4 * Math.PI;
const BOID_VIEW_DISTANCE = 150;
const BOID_COLLISION_RAYS = 10;
const BOID_MAX_ALIGNMENT_FORCE = 0.075;
const BOID_MAX_COHESION_FORCE = 0.12;
const BOID_MAX_SEPARATON_FORCE = 0.15;
const BOID_MAX_AVOIDANCE_FORCE = 0.6;
const BOID_MAX_SPEED = 3;
const BOUNDS = [
    new Line(0, 0, WIDTH, 0),
    new Line(WIDTH, 0, WIDTH, HEIGHT),
    new Line(WIDTH, HEIGHT, 0, HEIGHT),
    new Line(0, HEIGHT, 0, 0),
];

const boids = new Array(POPULATION_SIZE).fill(0).map(e => new Boid());;
let start = 0;
let mp = { x: 0, y: 0 };

let fps = 0;
let fpsSamples = 0;


// TODO better influence of user boid by multiplying force
// TODO sliders

document.addEventListener('DOMContentLoaded', setup);

function setup() {
    const c = document.getElementById('c');
    c.width = window.innerWidth;
    c.height = window.innerHeight;

    document.addEventListener('mousemove', e => mp = { x: e.offsetX, y: e.offsetY });

    setInterval(showFPS, 500);

    window.requestAnimationFrame(update);
}

function update() {
    const delta = performance.now() - start;
    window.requestAnimationFrame(update);

    for(const boid of boids) boid.move();

    draw(delta);

    fps += 1000 / (performance.now() - start);
    fpsSamples++;

    start = performance.now();
}

function showFPS() {
    document.getElementById('fps').innerText = `${(fps / fpsSamples).toFixed(2)} FPS`;
    fps = 0;
    fpsSamples = 0;
}