"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ExhibitNavigator from "@/app/components/PageNavigator";

const DEFAULT_COLORS = ["#C0B135", "#945629", "#680F0F", "#944949", "#944242", "#FFFFFF"];

const GRADIENT_TYPES = [
  "Sharp Bézier",
  "Soft Bézier",
  "Mesh Static",
  "Mesh Grid",
  "Simple",
] as const;
type GradientType = typeof GRADIENT_TYPES[number];

// GradientCard.jsx
function GradientCard() {
  return (
    <div className="relative w-full max-w-md h-64 rounded-3xl overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#a94444] via-40% to-yellow-500"></div>

      {/* Noise Overlay */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-30 mix-blend-overlay"></div>
    </div>
  );
}


export default function GradientGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gradientType, setGradientType] = useState<GradientType>("Sharp Bézier");
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(240);
  const [colors, setColors] = useState<string[]>(DEFAULT_COLORS);
  const [gradientCode, setGradientCode] = useState("");
  const [warp, setWarp] = useState(0.5);
  const [warpSize, setWarpSize] = useState(0.5);
  const [noise, setNoise] = useState(0.2);
  const [softness, setSoftness] = useState(0.5);

  // Draw gradient on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        let gradient: CanvasGradient | undefined;
        if (gradientType === "Simple") {
          ctx.fillStyle = colors[0] || "#fff";
          ctx.fillRect(0, 0, width, height);
        } else if (
          gradientType === "Sharp Bézier" ||
          gradientType === "Soft Bézier"
        ) {
          // Voronoi-based approach with refinements
          const n = colors.length;
          const cx = width / 2;
          const cy = height / 2;
          const r = Math.min(width, height) * 0.35;
          // Deterministic warping for reproducibility
          const points = Array.from({ length: n }, (_, i) => {
            const angle = (2 * Math.PI * i) / n;
            // Use sine/cosine for deterministic warping
            const warpAngle = angle + (warp - 0.5) * Math.PI * 2 * warpSize * Math.sin(i * 2.3);
            const warpRadius = r * (1 + (warp - 0.5) * warpSize * Math.cos(i * 1.7));
            return [
              cx + Math.cos(warpAngle) * warpRadius,
              cy + Math.sin(warpAngle) * warpRadius,
            ];
          });
          // Get image data
          const imageData = ctx.createImageData(width, height);
          const data = imageData.data;
          for (let y = 0; y < height; ++y) {
            for (let x = 0; x < width; ++x) {
              // Find nearest and second-nearest control points
              let minDist = Infinity, minIdx = 0;
              let secondDist = Infinity, secondIdx = 0;
              let dists: number[] = [];
              for (let i = 0; i < n; ++i) {
                const dx = x - points[i][0];
                const dy = y - points[i][1];
                const dist = dx * dx + dy * dy;
                dists.push(dist);
                if (dist < minDist) {
                  secondDist = minDist;
                  secondIdx = minIdx;
                  minDist = dist;
                  minIdx = i;
                } else if (dist < secondDist) {
                  secondDist = dist;
                  secondIdx = i;
                }
              }
              let rC = 0, gC = 0, bC = 0;
              if (gradientType === "Sharp Bézier") {
                // Edge feathering: blend with second-closest color near boundary
                const d1 = Math.sqrt(minDist);
                const d2 = Math.sqrt(secondDist);
                const edgeWidth = 8 + 16 * (1 - warpSize); // px
                if (d2 - d1 < edgeWidth) {
                  // Blend
                  const t = (edgeWidth - (d2 - d1)) / edgeWidth;
                  const [r1, g1, b1] = hexToRgb(colors[minIdx]);
                  const [r2, g2, b2] = hexToRgb(colors[secondIdx]);
                  rC = r1 * (1 - t) + r2 * t;
                  gC = g1 * (1 - t) + g2 * t;
                  bC = b1 * (1 - t) + b2 * t;
                } else {
                  [rC, gC, bC] = hexToRgb(colors[minIdx]);
                }
              } else {
                // Soft: blend with neighbors based on distance and softness
                // Use a power function for softness
                let totalWeight = 0;
                const power = 2 + 10 * (1 - softness); // 2 (soft) to 12 (sharp)
                for (let i = 0; i < n; ++i) {
                  // Add a small value to avoid division by zero
                  const weight = 1 / Math.pow(Math.sqrt(dists[i]) + 1, power);
                  const [r, g, b] = hexToRgb(colors[i]);
                  rC += r * weight;
                  gC += g * weight;
                  bC += b * weight;
                  totalWeight += weight;
                }
                rC /= totalWeight;
                gC /= totalWeight;
                bC /= totalWeight;
              }
              const idx = (y * width + x) * 4;
              data[idx] = Math.round(rC);
              data[idx + 1] = Math.round(gC);
              data[idx + 2] = Math.round(bC);
              data[idx + 3] = 255;
            }
          }
          ctx.putImageData(imageData, 0, 0);
        } else if (
          gradientType === "Mesh Static" ||
          gradientType === "Mesh Grid"
        ) {
          // Placeholder: mesh rendering to be implemented next
          gradient = ctx.createLinearGradient(0, 0, width, height);
          colors.forEach((color, i) => {
            gradient!.addColorStop(i / (colors.length - 1), color);
          });
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, width, height);
        }
        // Add noise overlay if noise > 0
        if (noise > 0) {
          const imageData = ctx.getImageData(0, 0, width, height);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const nval = (Math.random() - 0.5) * 255 * noise * 0.25;
            data[i] = Math.min(255, Math.max(0, data[i] + nval));
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + nval));
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + nval));
          }
          ctx.putImageData(imageData, 0, 0);
        }
      }
    }
  }, [gradientType, width, height, colors, warp, warpSize, noise, softness]);

  // Generate CSS gradient code
  useEffect(() => {
    let code = "";
    if (gradientType === "Simple") {
      code = `background: ${colors[0] || "#fff"};`;
    } else {
      // Placeholder: use linear-gradient for all except 'Simple'
      code = `background: linear-gradient(135deg, ${colors.join(", ")});`;
    }
    setGradientCode(code);
  }, [gradientType, colors]);

  // Handlers
  const handleColorChange = (idx: number, value: string) => {
    setColors(colors.map((c, i) => (i === idx ? value : c)));
  };
  const handleAddColor = () => {
    setColors([...colors, "#FFFFFF"]);
  };
  const handleRemoveColor = (idx: number) => {
    if (colors.length > 2) setColors(colors.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-8">
      {/* Navigation Component */}
      <ExhibitNavigator />

      {/* Gradient Preview */}
      <div className="flex-1 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="rounded-3xl shadow-lg bg-white"
          style={{ maxWidth: 600, maxHeight: 360 }}
        />
      </div>

      <GradientCard />

      {/* Sidebar Controls */}
      <div className="w-[340px] ml-12 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 flex flex-col min-h-[400px]">
        <h2 className="text-xl font-semibold mb-4">Gradient Controls</h2>
        {/* Gradient Type */}
        <label className="mb-2 font-medium">Gradient Type</label>
        <select
          className="mb-4 p-2 rounded border dark:bg-gray-800 dark:text-white"
          value={gradientType}
          onChange={e => setGradientType(e.target.value as GradientType)}
        >
          {GRADIENT_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {/* Canvas Size */}
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-sm">Width</label>
            <input
              type="number"
              min={100}
              max={1920}
              value={width}
              onChange={e => setWidth(Number(e.target.value))}
              className="w-20 p-1 rounded border dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm">Height</label>
            <input
              type="number"
              min={100}
              max={1080}
              value={height}
              onChange={e => setHeight(Number(e.target.value))}
              className="w-20 p-1 rounded border dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>
        {/* Warp Controls */}
        <div className="mb-4">
          <label className="font-medium">Warp</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={warp}
            onChange={e => setWarp(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <label className="font-medium">Warp Size</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={warpSize}
            onChange={e => setWarpSize(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <label className="font-medium">Noise</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={noise}
            onChange={e => setNoise(Number(e.target.value))}
            className="w-full"
          />
        </div>
        {/* Softness Control (only for Soft Bézier) */}
        {gradientType === "Soft Bézier" && (
          <div className="mb-4">
            <label className="font-medium">Softness</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={softness}
              onChange={e => setSoftness(Number(e.target.value))}
              className="w-full"
            />
          </div>
        )}
        {/* Color Stops */}
        <div className="mb-4">
          <label className="font-medium">Colors</label>
          <div className="space-y-2 mt-2">
            {colors.map((color, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={e => handleColorChange(idx, e.target.value)}
                  className="w-8 h-8 border rounded"
                />
                <input
                  type="text"
                  value={color}
                  onChange={e => handleColorChange(idx, e.target.value)}
                  className="w-24 p-1 rounded border dark:bg-gray-800 dark:text-white"
                />
                {colors.length > 2 && (
                  <button
                    onClick={() => handleRemoveColor(idx)}
                    className="text-red-500 hover:text-red-700 text-lg"
                    title="Remove color"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={handleAddColor}
              className="mt-2 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              + Add Color
            </button>
          </div>
        </div>
        {/* Code Display */}
        <div className="mb-4">
          <label className="font-medium">CSS Code</label>
          <pre className="bg-gray-100 dark:bg-gray-800 rounded p-2 mt-2 text-xs overflow-x-auto select-all">
            {gradientCode}
          </pre>
        </div>
      </div>

      {/* Back Link */}
      <div className="fixed bottom-8 left-8">
        <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">← Back to Museum</Link>
      </div>
    </div>
  );
}

// Helper to convert hex to rgb
function hexToRgb(hex: string): [number, number, number] {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
  const num = parseInt(c, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
} 