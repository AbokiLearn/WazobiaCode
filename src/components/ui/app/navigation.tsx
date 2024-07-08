import Link from 'next/link';
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

const NavLinks = ({ course }: { course: CourseWithSections }) => {
  const NavItem = ({ href, text }: { href: string; text: string }) => {
    return (
      <Link
        href={href}
        className="text-sm font-medium block py-1 mx-2 text-left hover:text-primary"
      >
        {text}
      </Link>
    );
  };

  return (
    <>
      {course.sections.map((section, index) => (
        <AccordionItem key={index} value={section.slug}>
          <AccordionTrigger className="text-md font-semibold text-left">
            {section.title}
          </AccordionTrigger>
          <AccordionContent>
            {section.lectures.map((lecture, index) => {
              return (
                <NavItem
                  key={index}
                  href={`/app/courses/${course.slug}/${section.slug}/${lecture.slug}`}
                  text={lecture.title}
                />
              );
            })}
          </AccordionContent>
        </AccordionItem>
      ))}
    </>
  );
};

export const SidebarNav = ({ course }: { course: CourseWithSections }) => {
  return (
    <div className="hidden border-r bg-muted md:flex md:flex-col md:w-[300px] md:min-h-screen overflow-y-auto">
      <div className="flex flex-col gap-2">
        <nav className="grid items-start text-sm font-medium px-2 lg:px-4">
          <Accordion type="single" collapsible className="w-full">
            <NavLinks course={course} />
          </Accordion>
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
        <Accordion type="single" collapsible className="w-full">
          <NavLinks course={course} />
        </Accordion>
      </nav>
      <div className="mt-auto mb-4">
        <SearchBar placeholder="Search course content..." inSheet />
      </div>
    </SheetMenu>
  );
};
