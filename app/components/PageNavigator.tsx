'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { projects, getProjectByRoute, Project } from '../types/projects';

interface PageNavigatorProps {
  className?: string;
}

export default function PageNavigator({
  className = '' 
}: PageNavigatorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  // Detect current project based on pathname
  useEffect(() => {
    const project = getProjectByRoute(pathname);
    setCurrentProject(project || null);
  }, [pathname]);

  const navigateToProject = (project: Project) => {
    router.push(project.route);
    setIsOpen(false);
  };

  const goToPrevious = () => {
    if (currentProject) {
      const currentIndex = projects.findIndex(p => p.id === currentProject.id);
      if (currentIndex > 0) {
        navigateToProject(projects[currentIndex - 1]);
      }
    }
  };

  const goToNext = () => {
    if (currentProject) {
      const currentIndex = projects.findIndex(p => p.id === currentProject.id);
      if (currentIndex < projects.length - 1) {
        navigateToProject(projects[currentIndex + 1]);
      }
    }
  };

  const isFirstProject = currentProject ? projects.findIndex(p => p.id === currentProject.id) === 0 : true;
  const isLastProject = currentProject ? projects.findIndex(p => p.id === currentProject.id) === projects.length - 1 : true;

  return (
    <div className={`relative ${className}`}>
      {/* Main Navigation Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50"
        aria-label="Navigate to projects"
      >
        <svg 
          className={`w-6 h-6 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>

      {/* Navigation Menu */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-40 min-w-[280px] max-w-[320px]">
          {/* Current Project Display */}
          <div className="text-center mb-4 pb-3 border-b border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Project</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {currentProject ? currentProject.name : 'Home'}
            </p>
            {currentProject && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {currentProject.category}
              </p>
            )}
          </div>

          {/* Quick Navigation Buttons */}
          <div className="flex justify-between mb-3">
            <button
              onClick={goToPrevious}
              disabled={isFirstProject}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
            >
              ← Prev
            </button>
            <button
              onClick={goToNext}
              disabled={isLastProject}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
            >
              Next →
            </button>
          </div>

          {/* Projects List */}
          <div className="space-y-1 max-h-48 overflow-y-auto">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Go to:</p>
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => navigateToProject(project)}
                className={`w-full text-left px-2 py-1 text-sm rounded transition-colors ${
                  project.id === currentProject?.id
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{project.name}</span>
                  <span className="text-xs text-gray-400 ml-2">{project.id}</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {project.category}
                </div>
              </button>
            ))}
          </div>

          {/* Home Button */}
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
} 