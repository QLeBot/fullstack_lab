"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
//import "./gradient.css";
import GradientCanvas from "@/app/components/GradientCanvas";

export default function Exhibit1() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f9df77');
    gradient.addColorStop(0.5, '#945629');
    gradient.addColorStop(1, '#680f0f');
    gradient.addColorStop(0.7, '#944949');
    gradient.addColorStop(0.8, '#944242');
    gradient.addColorStop(1, '#942a61');

    // Fill canvas with gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add noise effect
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 30 - 15;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
    
    ctx.putImageData(imageData, 0, 0);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen items-center justify-center overflow-hidden">
      {/* Image Block */}
      <div className="w-full h-[50vh] relative">
        <img 
          src="/assets/img/main_header.webp"
          alt="Desert View"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Image Block */}
      <div className="w-full h-[50vh] relative">
        <img 
          src="/assets/img/image-mesh-gradient.png"
          alt="Mesh Gradient"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradient Block */}
      <div className="w-full h-[50vh] relative">
        <GradientCanvas
          className="w-full h-full"
          colorStops={[
            { offset: 0, color: "#0C090B" },
            { offset: 0.2, color: "#281A11" },
            { offset: 0.5, color: "#CAD1DD" },
            { offset: 0.5, color: "#462D1C" },
            { offset: 0.5, color: "#E0CDC5" },
            { offset: 0.5, color: "#3A393E" },
            { offset: 0.5, color: "#B5BED0" },
            { offset: 0.5, color: "#584436" },
            { offset: 0.5, color: "#9AAFC5" }
          ]}
        />
      </div>

      {/* Gradient Block */}
      <div className="w-full h-[50vh] relative">
        <GradientCanvas
          className="w-full h-full"
          colorStops={[
            { offset: 0, color: "#f9df77" },
            { offset: 0.5, color: "#945629" },
            { offset: 1, color: "#680f0f" },
            { offset: 0.7, color: "#944949" },
            { offset: 0.8, color: "#944242" },
            { offset: 1, color: "#942a61" }
          ]}
        />
      </div>
      
      {/* Gradient Block */}
      <div className="w-full h-[50vh] relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />
      </div>

      {/* Image Block */}
      <div className="w-full h-[50vh] relative">
        <img 
          src="/assets/img/desert_view.jpg"
          alt="Desert View"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Hero Section */}
      <header className="absolute top-0 left-0 right-0 mt-24 mb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 font-sans bg-clip-text text-black">Banyan Tree AlUla</h1>
        <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 max-w-2xl mx-auto mb-8 font-sans">Enjoy the beauty of the desert</p>
        <Link href="#features" className="inline-block px-8 py-3 rounded-full bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition">Explore Exhibits</Link>
      </header>

      {/* Features Section */}
      <section id="features" className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {[1, 2, 3].map((num) => (
          <div key={num} className="rounded-2xl bg-white/80 dark:bg-gray-900/80 shadow-xl p-8 flex flex-col items-center border border-gray-200 dark:border-gray-800 backdrop-blur-md">
            <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-200 via-pink-200 to-purple-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
              <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{num}</span>
            </div>
            <h2 className="text-2xl font-bold mb-2 font-sans">Exhibit {num}</h2>
            <p className="text-gray-600 dark:text-gray-300 text-center text-base font-sans">A unique interactive experience awaits in Exhibit {num}. Click below to enter this room.</p>
            <Link href={`/exhibit${num}`} className="mt-4 px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:scale-105 transition-transform">Enter Exhibit</Link>
          </div>
        ))}
      </section>

      {/* Call to Action */}
      <section className="w-full max-w-3xl mx-auto mb-24 text-center">
        <div className="rounded-2xl bg-gradient-to-r from-blue-500 via-pink-400 to-purple-500 p-8 shadow-2xl text-white font-sans">
          <h3 className="text-2xl md:text-3xl font-bold mb-2">Ready to explore more?</h3>
          <p className="mb-4 text-lg">Dive into each exhibit and experience the creativity of the web. New rooms are added regularly!</p>
          <Link href="#features" className="inline-block px-8 py-3 rounded-full bg-white/90 text-blue-700 font-semibold shadow hover:bg-white transition">Browse Exhibits</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto mb-6 text-gray-400 text-xs text-center font-sans">
        &copy; {new Date().getFullYear()} Museum of Pages. All rights reserved.
      </footer>
    </div>
  );
}