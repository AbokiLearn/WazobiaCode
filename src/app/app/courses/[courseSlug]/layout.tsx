import { Metadata } from 'next';
import Link from 'next/link';
import { Sidebar, SheetSidebar } from '@/components/app/sidebar';
import { SearchBar } from '@/components/app/search-bar';
import { getUser } from '@/components/app/profile-menu';
import { Header } from '@/components/app/header';
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
      <Header
        title={<Link href={`/app/courses/${course.slug}`}>{course.title}</Link>}
        user={user}
        searchBar={<SearchBar placeholder="Search courses..." />}
      >
        <SheetSidebar course={course} />
      </Header>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar course={course} />
        <main className="flex-1 bg-background overflow-y-auto">
          {children}
          <Footer />
        </main>
      </div>
    </div>
  );
}
