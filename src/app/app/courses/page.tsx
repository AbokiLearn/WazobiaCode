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
import HeaderLogo from '@/components/app/header-logo';
import { SearchBar } from '@/components/app/search-bar';
import { SheetMenu } from '@/components/app/sheet-menu';
import { ProfileMenu, getUser, type User } from '@/components/app/profile-menu';
import { cn } from '@/lib/utils';
import { getCoursesWithSections } from '@/lib/api';
import { CourseWithSections } from '@/types/db/course';

export const metadata: Metadata = {
  title: 'Course Catalog | WazobiaCode',
};

export default async function Page() {
  // TODO: Replace `user` with `session = await auth()` and `user = session?.user`
  const user = getUser();
  const courses = await getCoursesWithSections();

  return (
    <div className="flex flex-col flex-grow overflow-hidden">
      <header className="flex h-14 items-center gap-4 border-b bg-muted/60 px-4 lg:h-[60px] lg:px-6">
        <CourseCatalogSheetMenu user={user} />
        <HeaderLogo />
        <h2 className="font-semibold sm:flex sm:text-xl lg:text-2xl">
          Course Catalog
        </h2>
        <div className="ml-auto flex items-center gap-4">
          {user && <ProfileMenu user={user} />}
        </div>
      </header>
      <main className="flex-grow overflow-auto p-4 lg:p-6 bg-muted-foreground">
        <CourseList courses={courses} />
        <ComingSoonCard />
      </main>
    </div>
  );
}

const CourseList = ({ courses }: { courses: CourseWithSections[] }) => {
  return (
    <>
      {courses.map((course) => (
        <Card
          key={course.title}
          className={cn(
            'mx-1 mt-4 md:mx-6 overflow-hidden',
            course.active ? '' : 'bg-muted',
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
              <Link href={course.active ? `/app/courses/${course.slug}` : '#'}>
                <CardTitle>{course.title}</CardTitle>
              </Link>
            </div>
            <CardDescription>{course.description}</CardDescription>
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
                        course.active
                          ? `/app/courses/${course.slug}/${section.slug}`
                          : '#'
                      }
                      className={cn(
                        'text-md sm:font-semibold text-muted-foreground',
                        course.active
                          ? 'hover:text-primary transition-colors'
                          : '',
                      )}
                    >
                      {section.title}
                    </Link>
                  </div>
                ))}
            </div>
          </CardContent>
          <CardFooter className="items-center bg-muted py-3">
            <Link
              className={cn(
                'font-semibold',
                course.active
                  ? 'text-primary hover:text-primary-foreground transition-colors'
                  : 'text-muted-foreground',
              )}
              href={course.active ? `/app/courses/${course.slug}` : '#'}
            >
              {course.active ? 'View Course' : 'Coming Soon'}
            </Link>
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

const CourseCatalogSheetMenu = ({ user }: { user: User }) => {
  return (
    <SheetMenu>
      <nav className="grid gap-2 text-lg font-medium">
        <HeaderLogo inSheet />
        <h2 className="flex font-semibold text-xl">Course Catalog</h2>
      </nav>
      <div className="my-4">
        <SearchBar placeholder="Search courses..." inSheet />
      </div>
    </SheetMenu>
  );
};

const ComingSoonCard = () => {
  return (
    <Card className="mx-1 mt-4 bg-muted md:mx-6">
      <CardContent className="flex items-center justify-center p-6">
        <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center mr-6">
          <Image src="/library.svg" alt="Library" width={32} height={32} />
        </div>
        <div>
          <h2 className="text-xl font-semibold">New Courses Coming Soon</h2>
          <p className="text-sm text-slate-500">
            Stay tuned for more exciting courses!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
