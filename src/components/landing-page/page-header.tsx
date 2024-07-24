"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const PageHeader = ({
  isAuthPage = false,
}: {
  isAuthPage?: boolean;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, error } = useUser();

  if (error) {
    toast.error("Error fetching user");
  }

  const NavLinks = () => {
    return (
      <>
        <Link
          href="#"
          onClick={() =>
            document
              .getElementById("faq-section")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="py-2 text-foreground hover:text-accent"
        >
          FAQ
        </Link>
        <Link
          href="/courses"
          className="py-2 text-foreground hover:text-accent"
        >
          Courses
        </Link>
        {!isAuthPage && !user ? (
          <Button
            variant="outline"
            className="text-md font-normal hover:bg-card hover:text-foreground"
            asChild
          >
            <a href="/api/auth/login">Log In</a>
          </Button>
        ) : null}
      </>
    );
  };

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
        <NavLinks />
        {user && <ProfileMenu />}
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
            <NavLinks />
            {user && <ProfileMenu />}
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

const ProfileMenu = () => {
  const { user, error } = useUser();

  if (error) {
    toast.error("Error fetching user");
    return null;
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.picture || ""} />
              <AvatarFallback>
                <UserIcon />
              </AvatarFallback>
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Hi, {user.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <a href="/api/auth/logout">
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </a>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else {
    return (
      <Button
        variant="link"
        className="text-lg font-medium text-primary-foreground hover:text-accent hover:underline hover:underline-offset-8"
      >
        <a href="/api/auth/login">Log In</a>
      </Button>
    );
  }
};
