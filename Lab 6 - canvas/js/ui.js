function draw(delta) {
    const ctx = document.getElementById('c').getContext('2d');
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    for(const boid of boids) boid.draw(ctx);
}