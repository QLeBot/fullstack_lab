import Link from "next/link";

export default function Exhibit1() {
  return (
    <div className="relative flex flex-col min-h-screen items-center justify-center overflow-hidden">
      {/* Background gradient and noise overlay */}
      <div className="absolute inset-0 -z-10">
        <div className="w-full h-full bg-gradient-to-br from-blue-100 via-pink-100 to-purple-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
        <div className="w-full h-full absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E')", backgroundRepeat: 'repeat'}} />
      </div>
      {/* Hero Section */}
      <header className="mt-24 mb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 font-sans bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-pink-500 to-purple-600">Museum of Pages</h1>
        <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 max-w-2xl mx-auto mb-8 font-sans">Explore a curated collection of interactive web exhibits. Each room is a unique experience—step inside and discover something new!</p>
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