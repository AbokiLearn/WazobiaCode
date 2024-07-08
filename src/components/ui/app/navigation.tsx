'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import HeaderLogo from '@/components/ui/app/header-logo';
import { SearchBar } from '@/components/ui/app/search-bar';
import { SheetMenu } from '@/components/ui/app/sheet-menu';
import { CourseWithSections } from '@/types/db/course';
import { cn } from '@/lib/utils';

const NavLinks = ({ course }: { course: CourseWithSections }) => {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>('');
  const [activeLecture, setActiveLecture] = useState<string>('');

  useEffect(() => {
    const currentSection = course.sections.find((section) =>
      pathname.includes(`/${section.slug}`),
    );
    const currentLecture = currentSection?.lectures.find((lecture) =>
      pathname.includes(`/${lecture.slug}`),
    );
    setActiveSection(currentSection?.slug || '');
    setActiveLecture(currentLecture?.slug || '');
  }, [pathname, course.sections]);

  const NavItem = ({
    href,
    text,
    isActive,
    className,
  }: {
    href: string;
    text: string;
    isActive: boolean;
    className?: string;
  }) => {
    return (
      <Link
        href={href}
        className={cn(
          'text-sm font-medium block py-1 mx-2 text-left hover:text-primary',
          isActive ? 'text-primary font-bold' : '',
          className,
        )}
      >
        {text}
      </Link>
    );
  };

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      value={activeSection}
      onValueChange={setActiveSection}
    >
      {course.sections.map((section, index) => {
        const isSectionActive = activeSection === section.slug;
        return (
          <AccordionItem key={index} value={section.slug}>
            <AccordionTrigger className="text-md font-semibold text-left">
              <NavItem
                href={`/app/courses/${course.slug}/${section.slug}`}
                text={section.title}
                isActive={isSectionActive}
                className="text-md font-semibold"
              />
            </AccordionTrigger>
            <AccordionContent>
              {section.lectures.map((lecture, index) => {
                const isLectureActive = activeLecture === lecture.slug;
                return (
                  <NavItem
                    key={index}
                    href={`/app/courses/${course.slug}/${section.slug}/${lecture.slug}`}
                    text={lecture.title}
                    isActive={isLectureActive}
                  />
                );
              })}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export const SidebarNav = ({ course }: { course: CourseWithSections }) => {
  return (
    <div className="hidden border-r bg-muted md:flex md:flex-col md:w-[300px] h-full overflow-y-auto">
      <div className="flex flex-col gap-2">
        <nav className="grid items-start text-sm font-medium px-2 lg:px-4">
          <NavLinks course={course} />
        </nav>
      </div>
    </div>
  );
};

export const SheetNav = ({ course }: { course: CourseWithSections }) => {
  return (
    <SheetMenu>
      <HeaderLogo inSheet />
      <h1 className="text-2xl font-bold">{course.title}</h1>
      <nav className="grid gap-2 text-lg font-medium">
        <NavLinks course={course} />
      </nav>
      <div className="mt-auto mb-4">
        <SearchBar placeholder="Search course content..." inSheet />
      </div>
    </SheetMenu>
  );
};
