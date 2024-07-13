'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const PageHeader = ({
  isAuthPage = false,
}: {
  isAuthPage?: boolean;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between pb-2 mb-8 relative border-b border-muted">
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="WazobiaCode Logo"
            width={54}
            height={54}
            className="mr-2 rounded-lg"
          />
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold">WazobiaCode</h1>
      </div>
      <nav className="hidden md:flex items-center space-x-4 text-lg">
        <Link
          href="#"
          onClick={() =>
            document
              .getElementById('faq-section')
              ?.scrollIntoView({ behavior: 'smooth' })
          }
          className="text-foreground hover:text-accent"
        >
          FAQ
        </Link>
        <Link href="/courses" className="text-foreground hover:text-accent">
          Courses
        </Link>
        {!isAuthPage ? (
          <Button
            variant="outline"
            className="text-md font-normal hover:bg-card hover:text-foreground"
            asChild
          >
            <Link href="/login">Log In</Link>
          </Button>
        ) : null}
      </nav>
      <Button
        className="md:hidden bg-background hover:text-accent hover:border-accent hover:bg-background"
        variant="outline"
        size="icon"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <MenuIcon className="h-6 w-6" />
      </Button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full right-0 w-full bg-white shadow-md rounded-b-lg md:hidden">
          <nav className="flex flex-col p-4">
            <Link
              href=""
              onClick={() => {
                document
                  .getElementById('faq-section')
                  ?.scrollIntoView({ behavior: 'smooth' });
                setIsMenuOpen(false);
              }}
              className="py-2 text-foreground hover:text-accent"
            >
              FAQ
            </Link>
            <Link
              href="/courses"
              className="py-2 text-foreground hover:text-accent"
              onClick={() => {
                setIsMenuOpen(false);
              }}
            >
              Courses
            </Link>
            {!isAuthPage && (
              <Button
                variant="outline"
                asChild
                className="mt-2 hover:bg-card hover:text-foreground"
              >
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  Log In
                </Link>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
