'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

function MountainIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

const PageHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthPage, setIsAuthPage] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Function to check if the current page is an auth page
    const checkIfAuthPage = (url: string) => {
      return url.endsWith('/login') || url.endsWith('/signup');
    };

    // Set initial state based on the current pathname
    setIsAuthPage(checkIfAuthPage(pathname));
  }, [pathname, searchParams]);
  return (
    <header className="bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16 md:h-20">
        <Link href="/" className="flex items-center">
          <MountainIcon className="h-8 w-8 md:h-12 md:w-12 text-gray-800" />
          <span className="text-lg font-bold ml-2">MKULTRA</span>
        </Link>
        {/* Menu button for small screens */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button"
            className="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            {/* Icon for menu button */}
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        {/* Navigation links for medium screens and up */}
        <div className={'hidden md:block flex-1 text-center '}>
          <nav className="flex justify-between items-center">
            <div className="flex justify-center flex-1">
              <div className="inline-flex space-x-4 md:space-x-8">
                <Link
                  className={
                    'inline-flex h-12 items-center justify-center rounded-md bg-white px-6 py-3 text-base font-medium mx-1 hover:text-gray-900'
                  }
                  href={'/'}
                >
                  Home
                </Link>
                <Link
                  className={
                    'inline-flex h-12 items-center justify-center rounded-md bg-white px-6 py-3 text-base font-medium mx-1 hover:text-gray-900'
                  }
                  href={'#'}
                >
                  Courses
                </Link>
                <Link
                  className={
                    'inline-flex h-12 items-center justify-center rounded-md bg-white px-6 py-3 text-base font-medium mx-1 hover:text-gray-900'
                  }
                  href={'#'}
                >
                  Quizzes
                </Link>
                <Link
                  className={
                    'inline-flex h-12 items-center justify-center rounded-md bg-white px-6 py-3 text-base font-medium mx-1 hover:text-gray-900'
                  }
                  href={'#'}
                >
                  Software Stacks
                </Link>
                <Link
                  className={
                    'inline-flex h-12 items-center justify-center rounded-md bg-white px-6 py-3 text-base font-medium mx-1 hover:text-gray-900'
                  }
                  href={'#'}
                >
                  Articles
                </Link>
              </div>
            </div>
            {!isAuthPage && (
              <div>
                {/* Placeholder for user authentication state */}
                {/* Show either Sign Up or Profile Icon */}
                {/* Add logic here based on authentication state */}
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center bg-black text-white rounded-md px-4 py-2 hover:bg-gray-800"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
      {/* Mobile menu, show/hide based on menu state */}
      <div
        className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}
        id="mobile-menu"
      >
        <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
          {/* Mobile Navigation links */}
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
          >
            Home
          </Link>
          <Link
            href="#"
            className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
          >
            Courses
          </Link>
          <Link
            href="#"
            className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
          >
            Quizzes
          </Link>
          <Link
            href="#"
            className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
          >
            Software Stacks
          </Link>
          <Link
            href="#"
            className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
          >
            Articles
          </Link>
          {!isAuthPage && (
            <div>
              {/* Placeholder for user authentication state */}
              {/* Show either Sign Up or Profile Icon */}
              {/* Add logic here based on authentication state */}
              <Link
                href="/signup"
                className="inline-flex items-center justify-center bg-black text-white rounded-md px-4 py-2 hover:bg-gray-800"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
