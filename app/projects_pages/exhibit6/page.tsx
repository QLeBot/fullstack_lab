'use client';

import { useState, useRef, useEffect } from 'react';
import ColorThief from 'colorthief';
import Link from "next/link";
import ExhibitNavigator from "@/app/components/PageNavigator";

export default function Exhibit3() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [palette, setPalette] = useState<number[][]>([]);
  const [complementaryPalette, setComplementaryPalette] = useState<number[][]>([]);
  const [neighboringPalette, setNeighboringPalette] = useState<number[][]>([]);
  const [selectedColors, setSelectedColors] = useState<number[][]>([]);
  const [colorCoordinates, setColorCoordinates] = useState<{ x: number; y: number }[]>([]);
  const [triangles, setTriangles] = useState<number[][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // Combined state for colors and coordinates
  const [colorPoints, setColorPoints] = useState<Array<{ color: number[], coord: { x: number, y: number } }>>([]);

  const handleColorSelect = (color: number[]) => {
    setColorPoints(prev => {
      // If color is already selected, remove it
      if (prev.some(p => p.color.join(',') === color.join(','))) {
        return prev.filter(p => p.color.join(',') !== color.join(','));
      }
      
      // Otherwise add it (limit to 5 colors)
      if (prev.length >= 5) {
        return prev;
      }

      return [...prev, {
        color,
        coord: { x: Math.random(), y: Math.random() }
      }];
    });
  };

  const handleColorMove = (index: number, x: number, y: number) => {
    setColorPoints(prev => {
      const newPoints = [...prev];
      newPoints[index] = {
        ...newPoints[index],
        coord: { x, y }
      };
      return newPoints;
    });
  };

  // Update separate states when colorPoints changes
  useEffect(() => {
    setSelectedColors(colorPoints.map(p => p.color));
    setColorCoordinates(colorPoints.map(p => p.coord));
  }, [colorPoints]);

  const isColorSelected = (color: number[]) => {
    return selectedColors.some(c => c.join(',') === color.join(','));
  };

  const interpolateColor = (color1: number[], color2: number[], factor: number) => {
    return color1.map((c1, i) => {
      const c2 = color2[i];
      // Use cubic easing for smoother transitions
      const t = factor * factor * (3 - 2 * factor);
      return Math.round(c1 + (c2 - c1) * t);
    });
  };

  const getColorAtPosition = (x: number, y: number, colors: number[][], coords: { x: number; y: number }[]) => {
    if (colors.length === 0 || coords.length === 0) {
      return [0, 0, 0]; // Return black if no colors
    }

    // Find the three closest colors
    const distances = coords.map((coord, i) => ({
      distance: Math.sqrt(Math.pow(coord.x - x, 2) + Math.pow(coord.y - y, 2)),
      index: i
    })).sort((a, b) => a.distance - b.distance);

    // If we have less than 3 colors, use all available colors
    const closest = distances.slice(0, Math.min(3, colors.length));
    const totalWeight = closest.reduce((sum, c) => sum + 1 / (c.distance + 0.0001), 0);

    // Interpolate between the closest colors using inverse distance weighting
    return closest.reduce((result, c) => {
      const weight = (1 / (c.distance + 0.0001)) / totalWeight;
      const color = colors[c.index] || [0, 0, 0]; // Fallback to black if color is undefined
      return result.map((r, i) => r + color[i] * weight);
    }, [0, 0, 0]).map(c => Math.round(c));
  };

  // Calculate barycentric coordinates for a point in a triangle
  const calculateBarycentricCoords = (
    px: number, py: number,
    x1: number, y1: number,
    x2: number, y2: number,
    x3: number, y3: number
  ) => {
    const denominator = ((y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3));
    const w1 = ((y2 - y3) * (px - x3) + (x3 - x2) * (py - y3)) / denominator;
    const w2 = ((y3 - y1) * (px - x3) + (x1 - x3) * (py - y3)) / denominator;
    const w3 = 1 - w1 - w2;
    return [w1, w2, w3];
  };

  // Check if a point is inside a triangle
  const isPointInTriangle = (baryCoords: number[]) => {
    return baryCoords.every(coord => coord >= 0 && coord <= 1);
  };

  // Interpolate color using barycentric coordinates
  const interpolateColorBarycentric = (colors: number[][], weights: number[]) => {
    return colors.reduce((result, color, i) => {
      return result.map((c, j) => c + color[j] * weights[i]);
    }, [0, 0, 0]).map(c => Math.round(c));
  };

  // Generate triangles using a simple triangulation
  const generateTriangles = (points: { x: number; y: number }[]) => {
    if (points.length < 3) return [];
    
    // Add points at the corners to ensure full coverage
    const corners = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 }
    ];
    const allPoints = [...points, ...corners];
    
    // Simple triangulation (can be improved with Delaunay)
    const triangles: number[][] = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        for (let k = j + 1; k < points.length; k++) {
          triangles.push([i, j, k]);
        }
      }
    }
    
    // Add triangles with corner points
    for (let i = 0; i < points.length; i++) {
      for (let j = 0; j < corners.length; j++) {
        const k = (j + 1) % corners.length;
        triangles.push([i, points.length + j, points.length + k]);
      }
    }
    
    return triangles;
  };

  // Force gradient update when colors or coordinates change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create mesh gradient
    if (colorPoints.length > 0) {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      // Generate gradient using weighted distance interpolation
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const normalizedX = x / canvas.width;
          const normalizedY = y / canvas.height;
          
          // Calculate weighted influence of each color point
          const influences = colorPoints.map(point => {
            const dx = point.coord.x - normalizedX;
            const dy = point.coord.y - normalizedY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Use inverse distance weighting with smoothing
            const weight = 1 / (distance + 0.1);
            return { weight, color: point.color };
          });

          // Normalize weights
          const totalWeight = influences.reduce((sum, inf) => sum + inf.weight, 0);
          
          // Interpolate color
          const finalColor = influences.reduce((result, inf) => {
            const normalizedWeight = inf.weight / totalWeight;
            return result.map((c, i) => c + inf.color[i] * normalizedWeight);
          }, [0, 0, 0]).map(c => Math.round(c));

          // Set pixel color
          const pixelIndex = (y * canvas.width + x) * 4;
          data[pixelIndex] = finalColor[0];     // R
          data[pixelIndex + 1] = finalColor[1]; // G
          data[pixelIndex + 2] = finalColor[2]; // B
          data[pixelIndex + 3] = 255;           // A
        }
      }

      ctx.putImageData(imageData, 0, 0);
    }

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [colorPoints]);

  const rgbToHex = (rgb: number[]) => {
    return '#' + rgb.map(c => c.toString(16).padStart(2, '0')).join('');
  };

  const getComplementaryColor = (rgb: number[]) => {
    return rgb.map(c => 255 - c);
  };

  const getNeighboringColor = (rgb: number[]) => {
    const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
    hsl[0] = (hsl[0] + 30) % 360; // Shift hue by 30 degrees
    return hslToRgb(hsl[0], hsl[1], hsl[2]);
  };

  const generateCodeSnippet = () => {
    const colorStrings = colorPoints.map(point => 
      `{ color: [${point.color.join(', ')}], coord: { x: ${point.coord.x.toFixed(3)}, y: ${point.coord.y.toFixed(3)} } }`
    ).join(',\n  ');

    return `const colorPoints = [
  ${colorStrings}
];

// Use with the mesh gradient generator
const gradient = generateMeshGradient(colorPoints, canvas.width, canvas.height);`;
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generateCodeSnippet());
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setImageUrl(url);
      
      const img = new Image();
      img.onload = () => {
        try {
          const colorThief = new ColorThief();
          const palette = colorThief.getPalette(img, 8);
          setPalette(palette);
          
          // Generate complementary and neighboring palettes
          const complementary = palette.map(color => getComplementaryColor(color));
          const neighboring = palette.map(color => getNeighboringColor(color));
          
          setComplementaryPalette(complementary);
          setNeighboringPalette(neighboring);
          
          setIsLoading(false);
        } catch (error) {
          console.error('Error extracting colors:', error);
          setIsLoading(false);
        }
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  };

  // Helper functions for color conversion
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <ExhibitNavigator />
      
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200">
            Interactive Color Palette Generator
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Image Upload and Color Extraction */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Upload Image
                </h2>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300"
                />
                {isLoading && (
                  <div className="mt-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Extracting colors...</p>
                  </div>
                )}
              </div>

              {imageUrl && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    Extracted Colors
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Main Palette</h4>
                      <div className="flex flex-wrap gap-2">
                        {palette.map((color, index) => (
                          <button
                            key={index}
                            onClick={() => handleColorSelect(color)}
                            className={`w-12 h-12 rounded-lg border-2 transition-all ${
                              isColorSelected(color) 
                                ? 'border-blue-500 scale-110 shadow-lg' 
                                : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                            }`}
                            style={{ backgroundColor: rgbToHex(color) }}
                            title={`RGB(${color.join(', ')})`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Complementary Colors</h4>
                      <div className="flex flex-wrap gap-2">
                        {complementaryPalette.map((color, index) => (
                          <button
                            key={index}
                            onClick={() => handleColorSelect(color)}
                            className={`w-12 h-12 rounded-lg border-2 transition-all ${
                              isColorSelected(color) 
                                ? 'border-blue-500 scale-110 shadow-lg' 
                                : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                            }`}
                            style={{ backgroundColor: rgbToHex(color) }}
                            title={`RGB(${color.join(', ')})`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Neighboring Colors</h4>
                      <div className="flex flex-wrap gap-2">
                        {neighboringPalette.map((color, index) => (
                          <button
                            key={index}
                            onClick={() => handleColorSelect(color)}
                            className={`w-12 h-12 rounded-lg border-2 transition-all ${
                              isColorSelected(color) 
                                ? 'border-blue-500 scale-110 shadow-lg' 
                                : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                            }`}
                            style={{ backgroundColor: rgbToHex(color) }}
                            title={`RGB(${color.join(', ')})`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Canvas and Controls */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Interactive Gradient Canvas
                </h2>
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-96 rounded-lg border-2 border-gray-200 dark:border-gray-700 cursor-crosshair"
                    style={{ background: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }}
                  />
                  
                  {/* Color point indicators */}
                  {colorPoints.map((point, index) => (
                    <div
                      key={index}
                      className="absolute w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-move"
                      style={{
                        backgroundColor: rgbToHex(point.color),
                        left: `${point.coord.x * 100}%`,
                        top: `${point.coord.y * 100}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        const canvas = canvasRef.current;
                        if (!canvas) return;

                        const rect = canvas.getBoundingClientRect();
                        const startX = e.clientX - rect.left;
                        const startY = e.clientY - rect.top;

                        const handleMouseMove = (moveEvent: MouseEvent) => {
                          const x = (moveEvent.clientX - rect.left) / rect.width;
                          const y = (moveEvent.clientY - rect.top) / rect.height;
                          handleColorMove(index, Math.max(0, Math.min(1, x)), Math.max(0, Math.min(1, y)));
                        };

                        const handleMouseUp = () => {
                          document.removeEventListener('mousemove', handleMouseMove);
                          document.removeEventListener('mouseup', handleMouseUp);
                        };

                        document.addEventListener('mousemove', handleMouseMove);
                        document.addEventListener('mouseup', handleMouseUp);
                      }}
                    />
                  ))}
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {colorPoints.map((point, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                    >
                      <div
                        className="w-4 h-4 rounded border border-gray-300 dark:border-gray-600"
                        style={{ backgroundColor: rgbToHex(point.color) }}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {rgbToHex(point.color)}
                      </span>
                      <button
                        onClick={() => {
                          setColorPoints(prev => prev.filter((_, i) => i !== index));
                        }}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Generation */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Generated Code
                  </h3>
                  <button
                    onClick={handleCopyCode}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {copySuccess ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>
                <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
                  <code className="text-gray-800 dark:text-gray-200">
                    {generateCodeSnippet()}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 