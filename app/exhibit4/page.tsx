import Link from "next/link";

export default function Exhibit4() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-8">
      <h1 className="text-3xl font-bold mb-4">Exhibit 4</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">This is a placeholder for Exhibit 4. Replace this with your content.</p>
      <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">← Back to Museum</Link>
    </div>
  );
} 