"use client";

import ExhibitNavigator from "@/app/components/PageNavigator";

export default function NewProject() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-8">
      {/* Navigation Component - automatically detects this project */}
      <ExhibitNavigator />

      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-gray-200">
          New Project Example
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          This is an example of a new project page. The PageNavigator component automatically 
          detects this project and includes it in the navigation without any manual configuration!
        </p>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            How it works:
          </h2>
          <ul className="text-left space-y-2 text-gray-600 dark:text-gray-300">
            <li>• Create a new folder in <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">app/projects_pages/</code></li>
            <li>• Add the project to the <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">projects</code> array in <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">app/types/projects.ts</code></li>
            <li>• Include <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">&lt;ExhibitNavigator /&gt;</code> in your page</li>
            <li>• The navigator automatically adapts to show your new project!</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 