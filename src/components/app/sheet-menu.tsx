import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SheetMenuProps {
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

export const SheetMenu = ({
  title,
  description,
  className,
  children,
}: SheetMenuProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 bg-primary text-primary-foreground md:hidden border-accent"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className={cn('flex flex-col overflow-auto', className)}
      >
        <SheetHeader>
          {title && <SheetTitle>{title}</SheetTitle>}
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
};
