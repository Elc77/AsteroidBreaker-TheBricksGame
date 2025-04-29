const starCanvas = document.getElementById('starCanvas');
const starCtx = starCanvas.getContext('2d');
let stars = [];

function resizeStarCanvas() {
  starCanvas.width = window.innerWidth;
  starCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeStarCanvas);
resizeStarCanvas();

// Create stars
for (let i = 0; i < 800; i++) {
  stars.push({
    x: Math.random() * starCanvas.width,
    y: Math.random() * starCanvas.height,
    radius: Math.random() * 1.5,
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: (Math.random() - 0.5) * 0.5
  });
}

// Animate stars
function animateStars() {
  starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);

  starCtx.fillStyle = 'yellow';
  stars.forEach(star => {
    starCtx.beginPath();
    starCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    starCtx.fill();

    star.x += star.speedX;
    star.y += star.speedY;

    if (star.x < 0) star.x = starCanvas.width;
    if (star.x > starCanvas.width) star.x = 0;
    if (star.y < 0) star.y = starCanvas.height;
    if (star.y > starCanvas.height) star.y = 0;
  });

  requestAnimationFrame(animateStars);
}
animateStars();
