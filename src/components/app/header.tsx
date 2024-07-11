import Link from 'next/link';

import { ProfileMenu, type User } from '@/components/app/profile-menu';
import HeaderLogo from '@/components/app/header-logo';
import { Search } from '@/components/app/search';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string | React.ReactNode;
  user: User;
  children?: React.ReactNode;
}

export const HeaderLinks = ({ className }: { className?: string }) => {
  const pages = [
    {
      label: 'Courses',
      href: '/app/courses',
    },
    {
      label: 'FAQ',
      href: '/app/faq',
    },
  ];

  return (
    <>
      {pages.map((page) => (
        <Link
          href={page.href}
          key={page.href}
          className={cn(
            'text-primary-foreground hover:text-primary hover:bg-accent rounded-lg px-2 py-1',
            className,
          )}
        >
          {page.label}
        </Link>
      ))}
    </>
  );
};

export const Header = ({ title, user, children }: HeaderProps) => {
  return (
    <header className="flex h-16 items-center gap-4 border-b border-b-accent bg-primary px-4 lg:h-[60px] lg:px-6">
      {children}
      <HeaderLogo className={cn('hidden', 'sm:block')} />
      <div className="flex flex-row justify-between gap-6">
        <HeaderLinks className="text-lg font-semibold" />
      </div>
      <div className="ml-auto flex items-center gap-4">
        <Search />
        {user && <ProfileMenu user={user} />}
      </div>
    </header>
  );
};
