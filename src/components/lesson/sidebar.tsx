import Link from 'next/link';
import { PiIcon } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-full md:w-1/4 pr-0 md:pr-6 space-y-2 bg-pastel-gray">
      <div className="flex items-center space-x-2 py-2 px-4">
        <PiIcon className="w-4 h-4" />
        <h2 className="text-lg font-bold">Python</h2>
      </div>
      <Link
        className="block py-2 px-4 rounded-md bg-white text-sm font-medium"
        href="#"
      >
        Lesson 1: Python Basics
      </Link>
      <Link
        className="block py-2 px-4 rounded-md bg-white text-sm font-medium"
        href="#"
      >
        Lesson 2: Advanced Python
      </Link>
      <Link
        className="block py-2 px-4 rounded-md bg-white text-sm font-medium"
        href="#"
      >
        Lesson 3: Python for Web
      </Link>
      <Link
        className="block py-2 px-4 rounded-md bg-white text-sm font-medium"
        href="#"
      >
        Lesson 4: Python and Databases
      </Link>
      <Link
        className="block py-2 px-4 rounded-md bg-white text-sm font-medium"
        href="#"
      >
        Final Assignment: Build a Python Web App
      </Link>
    </aside>
  );
}
