import Link from 'next/link';

import { ProfileMenu } from '@/components/app/profile-menu';
import HeaderLogo from '@/components/app/header-logo';
import { cn } from '@/lib/utils';

export const HeaderLinks = ({ className }: { className?: string }) => {
  const pages = [
    {
      label: 'Courses',
      href: '/courses',
    },
    // {
    //   label: 'FAQ',
    //   href: '/faq',
    // },
  ];

  return (
    <>
      {pages.map((page) => (
        <Link
          href={page.href}
          key={page.href}
          className={cn(
            'text-primary-foreground hover:text-accent hover:underline hover:underline-offset-8 px-2',
            className,
          )}
        >
          {page.label}
        </Link>
      ))}
    </>
  );
};

export const Header = async ({ children }: { children?: React.ReactNode }) => {
  return (
    <header className="flex h-16 items-center gap-4 border-b border-b-accent bg-primary px-4 lg:h-[60px] lg:px-6">
      {children}
      <HeaderLogo className="hidden sm:block" />
      <div className="flex flex-row justify-between gap-6">
        {/* <HeaderLinks className="text-lg font-semibold" /> */}
      </div>
      <div className="ml-auto flex items-center gap-4 md:gap-6">
        <HeaderLinks className="text-lg font-semibold" />
        <ProfileMenu />
      </div>
    </header>
  );
};
