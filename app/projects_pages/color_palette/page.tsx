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
            
            // Use inverse square law with a minimum influence
            const minInfluence = 0.1; // Minimum influence to ensure full coverage
            const weight = 1 / (Math.pow(distance, 1.8) + 0.0001) + minInfluence;
            
            return {
              weight,
              color: point.color
            };
          });

          // Normalize weights with softmax for smooth transitions
          const maxWeight = Math.max(...influences.map(inf => inf.weight));
          const expWeights = influences.map(inf => Math.exp(inf.weight - maxWeight));
          const totalWeight = expWeights.reduce((sum, w) => sum + w, 0);
          
          const normalizedInfluences = influences.map((inf, i) => ({
            weight: expWeights[i] / totalWeight,
            color: inf.color
          }));

          // Blend colors using weighted average
          const finalColor = normalizedInfluences.reduce((result, inf) => {
            return result.map((c, i) => {
              const blended = c + inf.color[i] * inf.weight;
              return Math.round(blended);
            });
          }, [0, 0, 0]);
          
          const i = (y * canvas.width + x) * 4;
          data[i] = finalColor[0];     // R
          data[i + 1] = finalColor[1]; // G
          data[i + 2] = finalColor[2]; // B
          data[i + 3] = 255;           // A
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Add very subtle noise for texture
      const noiseData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const noise = noiseData.data;
      
      for (let i = 0; i < noise.length; i += 4) {
        const noiseValue = Math.random() * 4 - 2; // Further reduced noise intensity
        noise[i] = Math.max(0, Math.min(255, noise[i] + noiseValue));
        noise[i + 1] = Math.max(0, Math.min(255, noise[i + 1] + noiseValue));
        noise[i + 2] = Math.max(0, Math.min(255, noise[i + 2] + noiseValue));
      }
      
      ctx.putImageData(noiseData, 0, 0);
    } else if (palette.length > 0) {
      // Use extracted colors and neighboring colors for gradient if no colors are selected
      const allColors = [...palette, ...neighboringPalette];
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      allColors.forEach((color, index) => {
        const position = allColors.length === 1 ? 0 : index / (allColors.length - 1);
        gradient.addColorStop(position, rgbToHex(color));
      });
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      // Fallback gradient if no palette is available
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#f9df77');
      gradient.addColorStop(0.5, '#945629');
      gradient.addColorStop(1, '#680f0f');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [palette, neighboringPalette, colorPoints]);

  // Debug logging
  useEffect(() => {
    console.log('State Update:', {
      colorPoints: colorPoints.length,
      selectedColors: selectedColors.length,
      colorCoordinates: colorCoordinates.length,
      triangles: triangles.length
    });
  }, [colorPoints, selectedColors, colorCoordinates, triangles]);

  const rgbToHex = (rgb: number[]) => {
    return '#' + rgb.map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  const getComplementaryColor = (rgb: number[]) => {
    return rgb.map(color => 255 - color);
  };

  const getNeighboringColor = (rgb: number[]) => {
    return rgb.map(color => {
      // Adjust each color component by a small random amount
      const adjustment = Math.floor(Math.random() * 30) - 15;
      return Math.max(0, Math.min(255, color + adjustment));
    });
  };

  const generateCodeSnippet = () => {
    const paletteHex = palette.map(rgbToHex);
    const complementaryHex = complementaryPalette.map(rgbToHex);
    const neighboringHex = neighboringPalette.map(rgbToHex);
    
    return `// Original Color Palette
const originalPalette = {
  primary: '${paletteHex[0]}',
  secondary: '${paletteHex[1]}',
  accent1: '${paletteHex[2]}',
  accent2: '${paletteHex[3]}',
  accent3: '${paletteHex[4]}'
};

// Complementary Color Palette
const complementaryPalette = {
  primary: '${complementaryHex[0]}',
  secondary: '${complementaryHex[1]}',
  accent1: '${complementaryHex[2]}',
  accent2: '${complementaryHex[3]}',
  accent3: '${complementaryHex[4]}'
};

// Neighboring Color Palette
const neighboringPalette = {
  primary: '${neighboringHex[0]}',
  secondary: '${neighboringHex[1]}',
  accent1: '${neighboringHex[2]}',
  accent2: '${neighboringHex[3]}',
  accent3: '${neighboringHex[4]}'
};`;
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generateCodeSnippet());
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImageUrl(result);
        setIsLoading(true);
        
        // Wait for image to load before extracting colors
        const img = new Image();
        img.src = result;
        img.onload = () => {
          const colorThief = new ColorThief();
          const extractedPalette = colorThief.getPalette(img, 5);
          setPalette(extractedPalette);
          
          // Generate complementary palette
          const complementary = extractedPalette.map(getComplementaryColor);
          setComplementaryPalette(complementary);

          // Generate neighboring palette
          const neighboring = extractedPalette.map(getNeighboringColor);
          setNeighboringPalette(neighboring);
          
          setIsLoading(false);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-8">
      {/* Navigation Component */}
      <ExhibitNavigator />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Color Palette Generator</h1>
        
        <div className="mb-8">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-700
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-gray-100 file:text-gray-900
              hover:file:bg-gray-200"
          />
        </div>

        {isLoading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-700">Analyzing image...</p>
          </div>
        )}

        {imageUrl && (
          <div className="space-y-8">
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <img
                src={imageUrl}
                alt="Uploaded"
                className="max-w-full h-auto rounded-lg"
                ref={imageRef}
              />
            </div>

            {palette.length > 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-gray-900">Extracted Color Palette</h2>
                  <div className="flex flex-wrap gap-4">
                    {palette.map((color, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 ${isColorSelected(color) ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                        onClick={() => handleColorSelect(color)}
                      >
                        <div
                          className="w-16 h-16 rounded-lg shadow"
                          style={{ backgroundColor: rgbToHex(color) }}
                        />
                        <span className="font-mono text-sm text-gray-900">{rgbToHex(color)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4 text-gray-900">Neighboring Color Palette</h2>
                  <div className="flex flex-wrap gap-4">
                    {neighboringPalette.map((color, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 ${isColorSelected(color) ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                        onClick={() => handleColorSelect(color)}
                      >
                        <div
                          className="w-16 h-16 rounded-lg shadow"
                          style={{ backgroundColor: rgbToHex(color) }}
                        />
                        <span className="font-mono text-sm text-gray-900">{rgbToHex(color)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4 text-gray-900">Complementary Color Palette</h2>
                  <div className="flex flex-wrap gap-4">
                    {complementaryPalette.map((color, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 ${isColorSelected(color) ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                        onClick={() => handleColorSelect(color)}
                      >
                        <div
                          className="w-16 h-16 rounded-lg shadow"
                          style={{ backgroundColor: rgbToHex(color) }}
                        />
                        <span className="font-mono text-sm text-gray-900">{rgbToHex(color)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {colorPoints.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">Selected Colors ({colorPoints.length}/5)</h2>
                    <div className="flex flex-wrap gap-4">
                      {colorPoints.map((point, index) => (
                        <div 
                          key={index} 
                          className="flex items-center gap-2"
                        >
                          <div
                            className="w-16 h-16 rounded-lg shadow relative"
                            style={{ backgroundColor: rgbToHex(point.color) }}
                          >
                            <div
                              className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full shadow cursor-move"
                              style={{
                                transform: `translate(${point.coord.x * 100}%, ${point.coord.y * 100}%)`,
                              }}
                              onMouseDown={(e) => {
                                const handleMouseMove = (moveEvent: MouseEvent) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  const x = Math.max(0, Math.min(1, (moveEvent.clientX - rect.left) / rect.width));
                                  const y = Math.max(0, Math.min(1, (moveEvent.clientY - rect.top) / rect.height));
                                  handleColorMove(index, x, y);
                                };
                                const handleMouseUp = () => {
                                  document.removeEventListener('mousemove', handleMouseMove);
                                  document.removeEventListener('mouseup', handleMouseUp);
                                };
                                document.addEventListener('mousemove', handleMouseMove);
                                document.addEventListener('mouseup', handleMouseUp);
                              }}
                            />
                          </div>
                          <span className="font-mono text-sm text-gray-900">{rgbToHex(point.color)}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setColorPoints([])}
                      className="mt-4 px-4 py-2 bg-red-100 text-red-900 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Clear Selection
                    </button>
                  </div>
                )}

                <div className="pt-4">
                  <button
                    onClick={() => setShowCode(!showCode)}
                    className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {showCode ? 'Hide Code' : 'Show Code'}
                  </button>

                  {showCode && (
                    <div className="mt-4 relative">
                      <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                        <code className="text-sm text-gray-900 font-mono">
                          {generateCodeSnippet()}
                        </code>
                      </pre>
                      <button
                        onClick={handleCopyCode}
                        className="absolute top-2 right-2 px-3 py-1 bg-gray-200 text-gray-900 rounded hover:bg-gray-300 transition-colors text-sm"
                      >
                        {copySuccess ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  {/* Gradient Block */}
                  <div className="w-full h-[50vh] relative">
                    <canvas
                      ref={canvasRef}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 