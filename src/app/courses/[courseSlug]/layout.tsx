import { getSession } from '@auth0/nextjs-auth0';
import { notFound } from 'next/navigation';

import { Sidebar, SidebarMobile } from '@/components/app/sidebar';
import { Header } from '@/components/app/header';
import { Footer } from '@/components/ui/footer';

import { getCourse } from '@/lib/client/course';
import { checkUserRole } from '@/lib/auth';
import { UserRole } from '@/types/auth';

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseSlug: string };
}) {
  const { courseSlug } = params;
  let course = null;

  const session = await getSession();
  const isInstructor = await checkUserRole(session, UserRole.INSTRUCTOR);

  try {
    course = await getCourse(courseSlug, true, true);
    if (!course) {
      throw new Error('Course not found');
    }
    if (!course.active && !isInstructor) {
      throw new Error('Course is not active');
    }
  } catch (error) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header>
        <SidebarMobile course={course} isInstructor={isInstructor} />
      </Header>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar course={course} isInstructor={isInstructor} />
        <div className="flex flex-col flex-1 w-full md:w-[calc(100%-300px)]">
          <main className="flex-1 bg-background overflow-y-auto">
            <div className="h-full overflow-y-auto">{children}</div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
