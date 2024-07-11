import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Header } from '@/components/app/header';
import { getUser } from '@/components/app/profile-menu';
import { Footer } from '@/components/ui/footer';
import { CourseWithSections } from '@/types/db/course';
import { getCoursesWithSections } from '@/lib/api';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Course Catalog | WazobiaCode',
};

export default async function Page() {
  // TODO: Replace `user` with `session = await auth()` and `user = session?.user`
  const user = getUser();
  const courses = await getCoursesWithSections();

  return (
    <>
      <div className="flex flex-col flex-grow overflow-hidden">
        <Header title="Course Catalog" user={user} />
        <main className="flex-grow bg-background text-foreground overflow-auto space-y-6 p-4 md:p-6">
          <CourseList courses={courses} />
          <ComingSoonCard />
        </main>
      </div>
      <Footer />
    </>
  );
}

const CourseList = ({ courses }: { courses: CourseWithSections[] }) => {
  return (
    <>
      {courses.map((course) => {
        const isActive = course.active;
        const cardClassName = isActive
          ? 'bg-card text-card-foreground'
          : 'bg-muted text-muted-foreground';

        return (
          <Card
            key={course.title}
            className={cn(
              'overflow-hidden mx-1 md:mx-6 border-border',
              cardClassName,
            )}
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                <Image
                  src={course.icon}
                  alt={course.title}
                  width={32}
                  height={32}
                />
                <Link href={isActive ? `/courses/${course.slug}` : '#'}>
                  <CardTitle>{course.title}</CardTitle>
                </Link>
              </div>
              <CardDescription
                className={cn(
                  '',
                  isActive ? 'text-card-foreground' : 'text-muted-foreground',
                )}
              >
                {course.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-row">
              <div className="flex-1">
                {course.sections
                  .sort((a, b) => a.section_num - b.section_num)
                  .filter((section) => section.section_num > 0)
                  .map((section) => (
                    <div
                      key={section.title}
                      className="flex items-center gap-2 p-1"
                    >
                      <Image
                        src={section.icon}
                        alt={section.title}
                        width={32}
                        height={32}
                      />
                      <Link
                        href={
                          isActive
                            ? `/courses/${course.slug}/${section.slug}`
                            : '#'
                        }
                        className={cn(
                          'text-md sm:font-[400]',
                          isActive ? 'hover:text-accent transition-colors' : '',
                        )}
                      >
                        {section.title}
                      </Link>
                    </div>
                  ))}
              </div>
            </CardContent>
            <CardFooter
              className={cn(
                'items-center py-3',
                isActive ? 'bg-muted-foreground' : 'bg-muted',
              )}
            >
              <Link
                className={cn(
                  'font-semibold',
                  isActive
                    ? 'text-accent hover:text-accent-foreground transition-colors'
                    : 'text-muted-foreground',
                )}
                href={course.active ? `/courses/${course.slug}` : '#'}
              >
                {course.active ? 'View Course' : 'Coming Soon'}
              </Link>
            </CardFooter>
          </Card>
        );
      })}
    </>
  );
};

const ComingSoonCard = () => {
  return (
    <Card className="bg-muted text-muted-foreground mx-1 md:mx-6 border-border">
      <CardContent className="flex items-center justify-center p-6">
        <div className="w-16 h-16 flex items-center justify-center mr-4">
          <Image src="/library.svg" alt="Library" width={48} height={48} />
        </div>
        <div>
          <h2 className="text-lg md:text-xl font-semibold">
            New Courses Coming Soon
          </h2>
          <p className="text-sm">Stay tuned for more exciting courses!</p>
        </div>
      </CardContent>
    </Card>
  );
};
