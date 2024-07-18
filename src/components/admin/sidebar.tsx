'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bot,
  GraduationCap,
  Home,
  Library,
  MessageCircleQuestion,
  Send,
  ScanEye,
} from 'lucide-react';

import { SheetMenu } from '@/components/ui/sheet-menu';
import { cn } from '@/lib/utils';

const MenuLinks = () => {
  const tab_links = [
    {
      href: '',
      icon: Home,
      label: 'Dashboard',
    },
    {
      href: '/courses',
      label: 'My Courses',
      icon: Library,
    },
    {
      href: '/students',
      label: 'Students',
      icon: GraduationCap,
    },
    {
      href: '/grading',
      label: 'Grading',
      icon: ScanEye,
    },
    {
      href: '/inbox', // this will be for questions students ask
      label: 'Inbox',
      icon: MessageCircleQuestion,
    },
    {
      href: '/telegram',
      label: 'Telegram',
      icon: Send,
    },
    {
      href: '/assistant',
      label: 'Assistant',
      icon: Bot,
    },
  ];

  const pathname = usePathname();

  return (
    <>
      {tab_links.map((tab, idx) => {
        const isActive = pathname === `/admin${tab.href}`;

        return (
          <Link
            key={idx}
            href={`/admin${tab.href}`}
            className={cn(
              'text-lg font-medium text-white border p-2 rounded-md flex items-center',
              'hover:border-accent',
              isActive ? 'border-accent text-accent-foreground font-bold' : '',
            )}
          >
            {tab.icon && <tab.icon className="mr-2" />}
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </>
  );
};

export const Sidebar = () => {
  return (
    <div className="hidden md:block border-r bg-primary w-[250px] min-h-screen overflow-y-auto">
      <div className="flex flex-col gap-2">
        <nav className="grid items-center px-2 py-6 text-sm font-medium gap-3 lg:px-4">
          <MenuLinks />
        </nav>
      </div>
    </div>
  );
};

export const SidebarMobile = () => {
  return (
    <SheetMenu className="bg-primary">
      <nav className="grid gap-2 text-lg font-medium">
        <MenuLinks />
      </nav>
    </SheetMenu>
  );
};
