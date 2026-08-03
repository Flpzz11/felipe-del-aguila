/**
 * Core Logic and Interactivity for flpzz11.github.io
 * Implements Intersection Observer scroll animation triggers
 * and footer copyright date initialization.
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Dynamic Year Initialization in Footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Intersection Observer for Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Stop observing once animated
        }
      });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
      root: null,
      threshold: 0.12, // Element is 12% visible in screen
      rootMargin: '0px 0px -40px 0px' // Trigger slightly before screen bounds
    });

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => {
      el.classList.add('active');
    });
  }

  // 3. Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.style.padding = '10px 0';
      navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
      navbar.style.background = 'rgba(61, 28, 84, 0.95)';
    } else {
      navbar.style.padding = '0';
      navbar.style.boxShadow = 'none';
      navbar.style.background = '#3D1C54';
    }
  });

  // 4. Dither Canvas Animation ("CÓDIGO ES POESÍA")
  const canvas = document.getElementById('dither-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width;
      canvas.height = height;
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    let time = 0;
    const pixelScale = 3; // 3px pixels for clear retro dithering
    
    // Typewriter terminal state machine
    let textState = 'typing'; // typing, waiting, deleting
    let charIndex = 2;        // Start after the prompt "> "
    let waitTimer = 0;
    const fullText = "> CÓDIGO ES POESÍA";
    
    const animate = () => {
      time += 1.5;
      
      // Clear canvas
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);
      
      const cx = width / 2;
      const cy = height / 2;
      
      // Draw concentric ripple dithered background
      for (let y = 0; y < height; y += pixelScale) {
        for (let x = 0; x < width; x += pixelScale) {
          const dx = x - cx;
          const dy = y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // Ripple function matching user's circular dithering reference image
          const wave = Math.sin(dist * 0.055 - time * 0.035);
          
          // Dither pattern density thresholds
          const checker = ((Math.floor(x / pixelScale) + Math.floor(y / pixelScale)) % 2 === 0);
          
          let draw = false;
          if (wave > 0.6) {
            draw = true; // Solid pixel density
          } else if (wave > 0.1 && wave <= 0.6) {
            draw = checker; // High-density dither pattern (50%)
          } else if (wave > -0.4 && wave <= 0.1) {
            // Low-density dither (25%)
            draw = (Math.floor(x / pixelScale) % 3 === 0 && Math.floor(y / pixelScale) % 3 === 0);
          } else if (wave > -0.8 && wave <= -0.4) {
            // Sparse noise dots (10%)
            draw = (Math.floor(x / pixelScale) % 5 === 0 && Math.floor(y / pixelScale) % 5 === 0);
          }
          
          if (draw) {
            // Draw in a soft, transparent off-white (#f4f3ee) for background texture
            ctx.fillStyle = 'rgba(244, 243, 238, 0.14)';
            ctx.fillRect(x, y, pixelScale, pixelScale);
          }
        }
      }
      
      // Typewriter simulation
      if (textState === 'typing') {
        charIndex += 0.15;
        if (charIndex >= fullText.length) {
          charIndex = fullText.length;
          textState = 'waiting';
          waitTimer = 0;
        }
      } else if (textState === 'waiting') {
        waitTimer += 1;
        if (waitTimer > 180) { // wait 3 seconds (60fps)
          textState = 'deleting';
        }
      } else if (textState === 'deleting') {
        charIndex -= 0.35; // delete text faster than typing
        if (charIndex <= 2) {
          charIndex = 2;
          textState = 'typing';
        }
      }
      
      // Compile display text and append cursor
      const displayText = fullText.substring(0, Math.floor(charIndex));
      const showCursor = Math.floor(time * 0.05) % 2 === 0;
      const finalRenderText = displayText + (showCursor ? '█' : ' ');
      
      // Write the text with code terminal aesthetic (color #f4f3ee)
      ctx.shadowColor = 'rgba(244, 243, 238, 0.3)';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#f4f3ee';
      ctx.font = '700 16px "Fira Code", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(finalRenderText, cx, cy);
      
      // Reset shadow
      ctx.shadowBlur = 0;
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }
});
