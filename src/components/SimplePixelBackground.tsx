'use client';

import { useEffect, useRef } from 'react';

interface SimplePixelBackgroundProps {
  pixelSize?: number;
  colors?: string[];
  speed?: number;
  density?: number;
}

export default function SimplePixelBackground({
  pixelSize = 4,
  colors = ['#06b6d4', '#22d3ee', '#0891b2', '#67e8f9'],
  speed = 0.02,
  density = 0.3
}: SimplePixelBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const pixels: Array<{
      x: number;
      y: number;
      color: string;
      alpha: number;
      speed: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Generate pixels
      pixels.length = 0;
      const cols = Math.floor(canvas.width / pixelSize);
      const rows = Math.floor(canvas.height / pixelSize);
      
      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          if (Math.random() < density) {
            pixels.push({
              x: x * pixelSize,
              y: y * pixelSize,
              color: colors[Math.floor(Math.random() * colors.length)],
              alpha: Math.random() * 0.8 + 0.2,
              speed: Math.random() * 0.02 + 0.01
            });
          }
        }
      }
    };

    const animate = () => {
      time += speed;
      
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      pixels.forEach((pixel) => {
        // Create wave effect
        const wave = Math.sin(time + pixel.x * 0.01 + pixel.y * 0.01) * 0.5 + 0.5;
        const alpha = pixel.alpha * wave * 0.8;
        
        ctx.fillStyle = pixel.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.fillRect(pixel.x, pixel.y, pixelSize, pixelSize);
        
        // Add some sparkle effect
        if (Math.random() < 0.001) {
          ctx.fillStyle = '#ffffff80';
          ctx.fillRect(pixel.x, pixel.y, pixelSize, pixelSize);
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [pixelSize, colors, speed, density]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
}