import { getSession } from '@auth0/nextjs-auth0';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const ProfileMenu = async ({ inSheet }: { inSheet?: boolean }) => {
  const session = await getSession();
  const user = session?.user;

  return (
    user && (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Avatar className={cn('w-10 h-10', inSheet ? 'w-12 h-12' : '')}>
              <AvatarImage src={user.picture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={inSheet ? 'start' : 'end'}>
          <DropdownMenuLabel>Hi, {user.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <a href="/api/auth/logout">
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </a>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
};
