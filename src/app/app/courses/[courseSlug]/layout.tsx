import { Metadata } from 'next';
import Link from 'next/link';
import HeaderLogo from '@/components/app/header-logo';
import { SearchBar } from '@/components/app/search-bar';
import { ProfileMenu, getUser } from '@/components/app/profile-menu';
import { SidebarNav, SheetNav } from '@/components/app/navigation';
import { Footer } from '@/components/ui/footer';
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
    <div className="flex flex-col h-screen">
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
      <div className="flex flex-1 overflow-hidden">
        <SidebarNav course={course} />
        <main className="flex-1 bg-muted-foreground overflow-y-auto">
          {children}
          <Footer />
        </main>
      </div>
    </div>
  );
}
