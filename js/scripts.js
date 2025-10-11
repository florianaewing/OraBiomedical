//Florian Ewing
//Ora Biomedical, Inc. 
//Ora Biomedical Website Scripts
//9.17.2025


// Navigation Link Animations
// Select all the navigation links
const navLinks = document.querySelectorAll('#navHome a');
navLinks.forEach((link, index) => {
  link.animate([
    { opacity: 0},
    { opacity: 1}
  ], {
    duration: 1000,
    easing: 'ease-out',
    delay: index * 300,  // Stagger by 300ms
    fill: 'forwards'
  });
});

  // Fade in image element
  document.addEventListener("DOMContentLoaded", () => {
    const img = document.getElementById('OraLogo_Header');

  function fadeInImage(element) {
    let opacity = 0;  // Start with the image invisible
    element.style.opacity = opacity;  // Set initial opacity
    const fadeInterval = setInterval(() => {
      opacity += 0.03;  // increment interval 
      element.style.opacity = opacity;

      if (opacity >= 1) {
        clearInterval(fadeInterval);
      }
    }, 30);  // 30 milliseconds interval
  }
  fadeInImage(img);
});

// Semi-transparent animated background container
function lerp(a, b, t) {
  return a + (b - a) * t;
}

const containers = document.querySelectorAll('.wave-container');

containers.forEach(container => {
  const canvas = container.querySelector('.wave-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Set canvas size to container size
  function resizeCanvas() {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const cols = 160;
  const rows = 80;

  let time = 0;
  let animationId = null;

  function draw() {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const spacingX = w / cols;
    const spacingY = h / rows;

    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const normX = (x / cols) * Math.PI * 4;
        const normY = (y / rows) * Math.PI * 4;

        const z1 = Math.sin(normX + time) * Math.cos(normY + time);
        const z2 = Math.sin(normY + time) * Math.cos(normX + time);
        const tMorph = (Math.sin(time * 0.25) + 1) / 2;
        const z = lerp(z1, z2, tMorph);

        const opacity = 1 - ((z + 1) / 2);
        ctx.fillStyle = `rgba(120, 120, 120, ${opacity * 0.45})`;

        const px = x * spacingX;
        const py = y * spacingY;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    time += 0.04;
    animationId = requestAnimationFrame(draw);
  }

  // Intersection Observer to pause/resume animation
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!animationId) draw();
      } else {
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      }
    });
  }, { threshold: 0.1 });

  observer.observe(container);
});

// Fade in/out sections based on scroll position
document.addEventListener('DOMContentLoaded', function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;

      if (entry.intersectionRatio >= 0.80) {
        // 60% or more in view — fade in
        el.classList.remove('fade-out');
        el.classList.add('fade-in');
      } else {
        // Less than 60% — fade out quickly
        el.classList.remove('fade-in');
        el.classList.add('fade-out');
      }
    });
  }, {
    threshold: Array.from({ length: 100 }, (_, i) => i / 100) // 0.00 to 0.99
  });

  document.querySelectorAll('.section').forEach(el => {
    observer.observe(el);
  });
});
