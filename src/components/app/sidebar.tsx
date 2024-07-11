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
import { SheetMenu } from '@/components/app/sheet-menu';
import { CourseWithSections } from '@/types/db/course';
import { cn } from '@/lib/utils';

const MenuLinks = ({ course }: { course: CourseWithSections }) => {
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
          'font-medium block py-1 mx-2 text-left hover:text-accent-foreground',
          isActive ? 'text-accent font-bold' : '',
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
      className="w-full text-primary-foreground"
      value={activeSection}
      onValueChange={setActiveSection}
    >
      {course.sections.map((section, index) => {
        const isSectionActive = activeSection === section.slug;
        return (
          <AccordionItem
            key={index}
            value={section.slug}
            className="border-b border-b-accent"
          >
            <AccordionTrigger>
              <NavItem
                href={`/courses/${course.slug}/${section.slug}`}
                text={section.title}
                isActive={isSectionActive}
                className="text-lg"
              />
            </AccordionTrigger>
            <AccordionContent>
              {section.lectures.map((lecture, index) => {
                const isLectureActive = activeLecture === lecture.slug;
                return (
                  <NavItem
                    key={index}
                    href={`/courses/${course.slug}/${section.slug}/${lecture.slug}`}
                    text={lecture.title}
                    isActive={isLectureActive}
                    className="text-md"
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

export const Sidebar = ({ course }: { course: CourseWithSections }) => {
  return (
    <div className="hidden border-r bg-primary md:flex md:flex-col md:w-[300px] h-full overflow-y-auto">
      <div className="flex flex-col gap-2">
        <nav className="grid items-start text-sm font-medium px-2 lg:px-4">
          <MenuLinks course={course} />
        </nav>
      </div>
    </div>
  );
};

export const SheetSidebar = ({ course }: { course: CourseWithSections }) => {
  return (
    <SheetMenu className="bg-primary">
      <nav className="grid gap-2 text-lg font-medium">
        <MenuLinks course={course} />
      </nav>
    </SheetMenu>
  );
};
