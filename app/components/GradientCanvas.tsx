import React, { useRef, useEffect } from "react";

type ColorStop = { offset: number; color: string };

interface GradientCanvasProps {
  colorStops: ColorStop[];
  direction?: { x0: number; y0: number; x1: number; y1: number };
  noise?: number;
  className?: string;
}

const GradientCanvas: React.FC<GradientCanvasProps> = ({
  colorStops,
  direction = { x0: 0, y0: 0, x1: 400, y1: 400 },
  noise = 15,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create gradient
    const gradient = ctx.createLinearGradient(
      direction.x0,
      direction.y0,
      direction.x1,
      direction.y1
    );
    colorStops.forEach(({ offset, color }) => {
      gradient.addColorStop(offset, color);
    });

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add noise
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const n = Math.random() * noise * 2 - noise;
      data[i] = Math.max(0, Math.min(255, data[i] + n));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + n));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + n));
    }
    ctx.putImageData(imageData, 0, 0);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [colorStops, direction, noise]);

  return <canvas ref={canvasRef} className={className} />;
};

export default GradientCanvas;