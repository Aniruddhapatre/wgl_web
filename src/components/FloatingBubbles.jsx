import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const BubblesCanvas = styled.canvas`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  display: block;

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

const FloatingBubbles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let width = 0,
      height = 0,
      dpr = Math.max(1, window.devicePixelRatio || 1);

    // ====== CONFIG ======
    const CONFIG = {
      BUBBLES_PER_CLICK: [10, 16],
      BASE_SIZE: [6, 14],
      LIFESPAN: [900, 1600],
      UP_SPEED: [-60, -140],
      H_DRIFT: [-40, 40],
      ROTATE: [-1.2, 1.2],
      GRAVITY: 12,
      COLORS: [
        ["#84fab0", "#8fd3f4"],
        ["#f6d365", "#fda085"],
        ["#a18cd1", "#fbc2eb"],
        ["#ffecd2", "#fcb69f"],
        ["#cfd9df", "#e2ebf0"],
      ],
      GLOW: true,
    };

    const bubbles = [];

    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }
    
    function choice(arr) {
      return arr[(Math.random() * arr.length) | 0];
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawnBubbles(x, y, count = null) {
      const n = count ?? Math.round(rand(CONFIG.BUBBLES_PER_CLICK[0], CONFIG.BUBBLES_PER_CLICK[1]));
      for (let i = 0; i < n; i++) {
        const size = rand(CONFIG.BASE_SIZE[0], CONFIG.BASE_SIZE[1]);
        const life = rand(CONFIG.LIFESPAN[0], CONFIG.LIFESPAN[1]);
        const col = choice(CONFIG.COLORS);
        bubbles.push({
          x,
          y,
          r: size,
          t: 0,
          life,
          vx: rand(CONFIG.H_DRIFT[0], CONFIG.H_DRIFT[1]),
          vy: rand(CONFIG.UP_SPEED[0], CONFIG.UP_SPEED[1]),
          rot: rand(0, Math.PI * 2),
          rotSpeed: rand(CONFIG.ROTATE[0], CONFIG.ROTATE[1]),
          colorA: col[0],
          colorB: col[1],
        });
      }
    }

    // Input handling (click / tap / hold)
    let painting = false;
    function pointerPos(e) {
      if (e.touches && e.touches[0]) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    }

    function handlePointerDown(e) {
      painting = true;
      const p = pointerPos(e);
      spawnBubbles(p.x, p.y);
    }

    function handlePointerMove(e) {
      if (!painting) return;
      const p = pointerPos(e);
      spawnBubbles(p.x, p.y, 6);
    }

    function handlePointerUp() {
      painting = false;
    }

    function handleTouchStart(e) {
      if (e.touches && e.touches.length > 0) e.preventDefault();
    }

    // Draw helpers
    function drawBubble(b) {
      const k = Math.min(1, b.t / b.life);
      const alpha = 1 - k;
      const scale = 1 + k * 0.3;
      const wobble = Math.sin(b.t / 120 + b.rot) * (b.r * 0.2);

      ctx.save();
      ctx.globalAlpha = Math.max(0, alpha);

      if (CONFIG.GLOW) {
        ctx.shadowColor = "rgba(255,255,255,0.25)";
        ctx.shadowBlur = 12;
      }

      const grad = ctx.createRadialGradient(
        b.x + wobble * 0.2,
        b.y,
        b.r * 0.1,
        b.x,
        b.y,
        b.r * scale
      );
      grad.addColorStop(0, b.colorA);
      grad.addColorStop(1, b.colorB);
      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.ellipse(
        b.x + wobble,
        b.y,
        b.r * scale,
        b.r * scale,
        b.rot,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.globalAlpha *= 0.6;
      ctx.beginPath();
      ctx.ellipse(
        b.x + wobble - b.r * 0.25,
        b.y - b.r * 0.35,
        b.r * 0.35,
        b.r * 0.25,
        0,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.fill();

      ctx.restore();
    }

    let last = performance.now();
    function tick(now) {
      const dt = Math.min(64, now - last);
      last = now;

      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.t += dt;
        const secs = dt / 1000;
        b.vy += CONFIG.GRAVITY * secs * 0.2;
        b.x += b.vx * secs;
        b.y += b.vy * secs;
        b.rot += b.rotSpeed * secs;

        if (
          b.t >= b.life ||
          b.y < -200 ||
          b.y > height + 200 ||
          b.x < -200 ||
          b.x > width + 200
        ) {
          bubbles.splice(i, 1);
        }
      }

      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < bubbles.length; i++) drawBubble(bubbles[i]);

      requestAnimationFrame(tick);
    }

    // Initialize
    resize();
    requestAnimationFrame(tick);

    // Demo bubbles
    setTimeout(() => spawnBubbles(width * 0.5, height * 0.6, 18), 500);

    // Event listeners
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  return <BubblesCanvas ref={canvasRef} />;
};

export default FloatingBubbles;