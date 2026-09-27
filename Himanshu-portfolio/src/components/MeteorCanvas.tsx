import React, { useEffect, useRef } from 'react';

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  len: number;
  opacity: number;
  active: boolean;
  delay: number;
  lastTime: number;
}

const MeteorCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let meteors: Meteor[] = [];
    const METEOR_COUNT = 8; // Number of active meteors

    const resize = () => {
      // Setup canvas for high-DPI displays
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    const initMeteors = () => {
      meteors = Array.from({ length: METEOR_COUNT }, () => createMeteor());
    };

    const createMeteor = (): Meteor => {
      const now = performance.now();
      // Start randomly offscreen or near edges
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * (window.innerHeight / 2) - window.innerHeight / 2; // Upper half or above
      
      const speed = 2 + Math.random() * 5;
      const angle = (Math.PI / 4) + (Math.random() * 0.2 - 0.1); // Roughly diagonal
      
      return {
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        len: 20 + Math.random() * 60,
        opacity: 0,
        active: false,
        delay: Math.random() * 8000,
        lastTime: now
      };
    };

    const drawMeteors = (time: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      
      meteors.forEach(meteor => {
        if (!meteor.active) {
          if (time - meteor.lastTime > meteor.delay) {
            meteor.active = true;
            meteor.opacity = 1;
            meteor.lastTime = time;
          }
          return;
        }

        meteor.x += meteor.vx;
        meteor.y += meteor.vy;
        
        // Draw meteor trail
        ctx.beginPath();
        const gradient = ctx.createLinearGradient(
          meteor.x, meteor.y, 
          meteor.x - meteor.vx * meteor.len * 0.1, 
          meteor.y - meteor.vy * meteor.len * 0.1
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${meteor.opacity})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(meteor.x - meteor.vx * meteor.len * 0.1, meteor.y - meteor.vy * meteor.len * 0.1);
        ctx.stroke();

        // Reset if offscreen
        if (meteor.x > window.innerWidth + 100 || meteor.y > window.innerHeight + 100) {
          Object.assign(meteor, createMeteor());
          meteor.lastTime = time;
        }
      });

      animationFrameId = requestAnimationFrame(drawMeteors);
    };

    window.addEventListener('resize', resize);
    resize();
    initMeteors();
    animationFrameId = requestAnimationFrame(drawMeteors);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0, // Behind everything
      }}
    />
  );
};

export default MeteorCanvas;
