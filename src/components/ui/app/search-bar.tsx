import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// TODO: include popup for search results, and tags

export const SearchBar = ({
  placeholder,
  inSheet = false,
}: {
  placeholder: string;
  inSheet?: boolean;
}) => {
  return (
    <div className={cn('relative', inSheet ? 'w-full' : 'w-72 hidden md:flex')}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        className="w-full appearance-none bg-background pl-8 shadow-none"
      />
    </div>
  );
};
