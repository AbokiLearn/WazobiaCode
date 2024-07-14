'use client';

import Link from 'next/link';
import { Search as SearchIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// TODO: enable search
// TODO: enable tag search

export const Search = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="text-accent hover:text-accent-foreground"
        >
          <SearchIcon className="h-8 w-8" />
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg max-w-[90%] md:max-w-[600px]">
        <form onSubmit={(e) => e.preventDefault()} className="grid gap-4 py-4">
          <div className="flex items-center">
            <Input
              type="search"
              placeholder="Search course content..."
              className="w-full rounded-full"
            />
            <Button
              variant="link"
              className="text-muted-foreground hover:text-accent active:text-accent"
            >
              <SearchIcon className="h-6 w-6" />
            </Button>
          </div>
          <div className="space-y-2">
            <div
              id="search-results"
              className="max-h-[200px] items-center overflow-y-auto"
            >
              {/* Placeholder for search results */}
              <p className="text-sm text-muted-foreground text-center">
                No results found.
              </p>
            </div>
          </div>
        </form>
        <DialogFooter className="w-full">
          <div className="flex justify-end">
            <Link
              href="/search"
              className="hover:text-accent active:text-accent"
            >
              See all results
            </Link>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
