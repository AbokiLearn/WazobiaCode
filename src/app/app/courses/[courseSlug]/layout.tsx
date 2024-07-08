import { Metadata } from 'next';
import Link from 'next/link';
import HeaderLogo from '@/components/ui/app/header-logo';
import { SearchBar } from '@/components/ui/app/search-bar';
import { ProfileMenu, getUser } from '@/components/ui/app/profile-menu';
import { SidebarNav, SheetNav } from '@/components/ui/app/navigation';
import { getCourseWithSections } from '@/lib/api';

export async function generateMetadata({
  params,
}: {
  params: { courseSlug: string };
}): Promise<Metadata> {
  const { courseSlug } = params;
  const course = await getCourseWithSections(courseSlug);

  return {
    title: `${course.title} | WazobiaCode`,
    description: course.description,
  };
}

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseSlug: string };
}) {
  const { courseSlug } = params;
  const user = getUser();
  const course = await getCourseWithSections(courseSlug);

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b bg-muted px-4 lg:h-[60px] lg:px-6">
        <SheetNav course={course} />
        <HeaderLogo />
        <h2 className="font-semibold sm:flex sm:text-xl lg:text-2xl">
          <Link href={`/app/courses/${course.slug}`}>{course.title}</Link>
        </h2>
        <div className="ml-auto flex items-center gap-4">
          <SearchBar placeholder="Search courses..." />
          {user && <ProfileMenu user={user} />}
        </div>
      </header>
      <main className="flex flex-1 bg-muted-foreground">
        <SidebarNav course={course} />
        <div className="flex flex-1 flex-col p-4 lg:gap-6 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
