'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split('/').filter((path) => path !== '');

  // Only show breadcrumbs if we're at least 2 levels deep into /admin
  if (paths.length < 3 || paths[0] !== 'admin') {
    return null;
  }

  // Remove 'admin' from the paths array
  paths.shift();

  return (
    <div className="mb-8">
      <Breadcrumb>
        <BreadcrumbList className="text-lg font-semibold">
          {paths.map((path, index) => {
            const href = `/admin/${paths.slice(0, index + 1).join('/')}`;
            const label = path
              .replace(/-/g, ' ')
              .replace(/\b\w/g, (c) => c.toUpperCase());
            return (
              <React.Fragment key={path}>
                <BreadcrumbItem>
                  {index === paths.length - 1 ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={href}>{label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < paths.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
