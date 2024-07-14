'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User as UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export const ProfileMenu = () => {
  const { user, error, isLoading } = useUser();

  if (error) {
    toast.error('Error fetching user');
  }

  if (user && !error) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.picture || ''} />
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

  return null;
};
