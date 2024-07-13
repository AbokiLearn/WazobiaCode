import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
}

export const getUser = () => {
  return {
    id: '66917c358d0b1b3cb24e5c47',
    name: 'John Doe',
    email: 'john.doe@example.com',
    image: 'https://images-dev-public.s3.amazonaws.com/Dazai_Infobox.png',
  } as User;
};

export const ProfileMenu = ({
  user,
  inSheet,
}: {
  user: User;
  inSheet?: boolean;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <Avatar className={cn('w-10 h-10', inSheet ? 'w-12 h-12' : '')}>
            <AvatarImage src={user.image} />
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
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
