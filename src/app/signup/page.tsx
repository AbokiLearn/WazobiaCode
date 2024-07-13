"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignUp() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <>
      <header className="flex items-center justify-between mb-8 relative">
        <div className="flex items-center">
          <Image
            src="/logo.svg"
            alt="WazobiaCode Logo"
            width={40}
            height={40}
            className="mr-2 rounded-lg"
          />
          <h1 className="text-2xl font-bold">WazobiaCode</h1>
        </div>
        <nav className="hidden md:flex items-center space-x-4">
          <Link
            href=""
            onClick={() =>
              document
                .getElementById("faq-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="text-gray-600 hover:text-gray-900"
          >
            FAQ
          </Link>
          <Link href="/courses" className="text-black hover:text-[--accent]">
            Courses
          </Link>
          <Button variant="outline" asChild>
            <Link href="/login">Log In</Link>
          </Button>
        </nav>
        <Button
          className="md:hidden"
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <MenuIcon className="h-6 w-6" />
        </Button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full right-0 w-full bg-white shadow-md rounded-b-lg md:hidden">
            <nav className="flex flex-col p-4">
              <Link
                href=""
                onClick={() => {
                  document
                    .getElementById("faq-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                  setIsMobileMenuOpen(false);
                }}
                className="py-2 text-gray-600 hover:text-gray-900"
              >
                FAQ
              </Link>
              <Link
                href="/courses"
                className="py-2 text-gray-600 hover:text-gray-900"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Courses
              </Link>
              <Button variant="outline" asChild className="mt-2">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  Log In
                </Link>
              </Button>
            </nav>
          </div>
        )}
      </header>
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <Card className="mx-auto max-w-sm">
              <CardHeader>
                <CardTitle className="text-xl">Sign Up</CardTitle>
                <CardDescription>
                  Enter your information to create an account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="first-name">First name</Label>
                      <Input id="first-name" placeholder="Max" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="last-name">Last name</Label>
                      <Input id="last-name" placeholder="Robinson" required />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" />
                  </div>
                  <Button type="submit" className="w-full">
                    Create an account
                  </Button>
                  <Button variant="outline" className="w-full">
                    Sign up with Google
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/login" className="underline">
                    Sign in
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="hidden bg-muted lg:block">
          <Image
            src="/placeholder.svg"
            alt="Image"
            width="1920"
            height="1080"
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </>
  );
}

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
