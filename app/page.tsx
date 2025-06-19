import Link from "next/link";
import Image from "next/image";
import { projects } from "./types/projects";

export default function Home() {
  const categories = [...new Set(projects.map(project => project.category))];

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-2">Dashboard of all pages</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Explore our collection of unique projects. Each room showcases different web development techniques and designs!
        </p>
      </header>
      
      <main className="w-full max-w-6xl">
        {categories.map((category) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {projects
                .filter(project => project.category === category)
                .map((project) => (
                  <Link
                    key={project.id}
                    href={project.route}
                    className="block rounded-xl shadow-lg bg-white dark:bg-gray-900 p-6 hover:scale-105 transition-transform border border-gray-200 dark:border-gray-700 group"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{project.id}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-center">{project.name}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-center text-sm">
                        {project.description}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </main>
      
      <footer className="mt-16 text-gray-400 text-xs text-center">
        &copy; {new Date().getFullYear()} Museum of Pages. All rights reserved.
      </footer>
    </div>
  );
}
