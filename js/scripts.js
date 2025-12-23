//Florian Ewing
//Ora Biomedical, Inc. 
//Ora Biomedical Website Scripts
//11.2.2025


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

  const cols = 180;
  const rows = 120;

  const points = new Array(cols * rows);

  // Precompute normalized positions once
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const idx = y + x * rows;
      points[idx] = {
        x,
        y,
        normX: (x / cols) * Math.PI * 4,
        normY: (y / rows) * Math.PI * 4,
      };
    }
  }

  function resizeCanvas() {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  let time = 0;
  let animationId = null;

  function draw() {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const spacingX = w / cols;
    const spacingY = h / rows;
    const tMorph = (Math.sin(time * 0.25) + 1) / 2;

    for (let i = 0; i < points.length; i++) {
      const p = points[i];

      const z1 = Math.sin(p.normX + time) * Math.cos(p.normY + time);
      const z2 = Math.sin(p.normY + time) * Math.cos(p.normX + time);
      const z = lerp(z1, z2, tMorph);

      const opacity = 1 - ((z + 1) / 2);
      ctx.fillStyle = `rgba(30, 144, 255, ${opacity * 0.65})`;

      ctx.beginPath();
      ctx.arc(p.x * spacingX, p.y * spacingY, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    time += 0.03;
    animationId = requestAnimationFrame(draw);
  }

  // Intersection Observer for pause/resume
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

      if (entry.intersectionRatio >= 0.60) {
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

//Personnel Carousel Movement
const track = document.querySelector('.carousel__track');
const items = Array.from(track.children);
let currentIndex = 0;

function updateCarousel() {
  const total = items.length;
  const spacing = 250; // horizontal spacing between images
  const depth = 150;   // how far back non-center items appear
  const scaleStep = 0.15;

  items.forEach((item, i) => {
    const offset = (i - currentIndex + total) % total;
    const caption = item.querySelector('.caption');

    let x = 0, z = 0, scale = 1, opacity = 1;

    if (offset === 0) {
      x = 0; z = 0; scale = 1; opacity = 1;
      caption.style.opacity = 1;
    } else {
      caption.style.opacity = 0;
      const dir = offset <= total / 2 ? 1 : -1;
      const dist = Math.min(offset, total - offset);
      x = dir * spacing * dist;
      z = -depth * dist;
      scale = 1 - scaleStep * dist;
      opacity = 1 - 0.3 * dist;
    }

    // 3D first, center last for proper spacing
    item.style.transform = `
      translateX(${x}px)
      translateZ(${z}px)
      scale(${scale})
      translate(-50%, -50%)
    `;
    item.style.opacity = opacity;
    item.style.zIndex = 1000 - Math.abs(offset);
  });
}

// Controls
document.getElementById("next").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % items.length;
  updateCarousel();
});
document.getElementById("prev").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + items.length) % items.length;
  updateCarousel();
});

// Initialize
updateCarousel();

//Captions for Home Page Intro
document.addEventListener("DOMContentLoaded", () => {
    const captionStartTimes = [0, 12, 25]; // seconds
    const captions = [
        "Ora Biomedical is Accelerating the Search for Longevity and Resilience",
        "Enhancing Therapies Using High-Throughput Live Animal Screening and Machine Learning",
        "Bridging Fundamental Science with Translational Breakthroughs"
    ];

    const captionElement = document.querySelector("main h3");

    function showCaption(index) {
        // fade out smoothly without affecting layout
        captionElement.style.transition = "opacity 0.5s ease";
        captionElement.style.opacity = 0;

        setTimeout(() => {
            captionElement.textContent = captions[index]; // update text
            captionElement.style.opacity = 1; // fade in
        }, 500); // match fade-out duration
    }

    captionStartTimes.forEach((startTime, index) => {
        setTimeout(() => {
            showCaption(index);
        }, startTime * 1000);
    });
});

// Set the loading screen to disappear after 3 seconds
    window.addEventListener('load', function() {
    setTimeout(function() {
        // Fade out the preloader
        document.getElementById('preloader').style.opacity = 0;

        // After the fade-out transition, remove the preloader element
        setTimeout(function() {
            document.getElementById('preloader').style.display = 'none';
        }, 1000); // Wait for the 1-second fade-out transition to finish
    }, 3000); // 3000 milliseconds = 3 seconds
});

// Function to adjust font size based on screen width
  function adjustFontSize() {
      const h1 = document.querySelector('h1');
      const h3 = document.querySelector('h3');

      // Adjust the font sizes based on window width
      if (window.innerWidth <= 480) {
          h1.style.fontSize = "2em";  // For small screens (e.g., mobile phones)
          h3.style.fontSize = "1.2em";  // For small screens
      } else if (window.innerWidth <= 768) {
          h1.style.fontSize = "1.2em";  // For tablets and smaller screens
          h3.style.fontSize = "1.2em";  // For tablets and smaller screens
      } else {
          h1.style.fontSize = "3.5em";  // For larger screens (desktop)
          h3.style.fontSize = "2em";  // For larger screens
      }
  }

  