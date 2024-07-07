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
import HeaderLogo from '@/components/ui/app/header-logo';
import { SearchBar } from '@/components/ui/app/search-bar';
import { SheetMenu } from '@/components/ui/app/sheet-menu';
import {
  ProfileMenu,
  getUser,
  type User,
} from '@/components/ui/app/profile-menu';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Course Catalog | WazobiaCode',
};

export default function Page() {
  // TODO: Replace `user` with `session = await auth()` and `user = session?.user`
  const user = getUser();

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b bg-muted/60 px-4 lg:h-[60px] lg:px-6">
        <CourseCatalogSheetMenu user={user} />
        <HeaderLogo />
        <h2 className="font-semibold sm:flex sm:text-xl lg:text-2xl">
          Course Catalog
        </h2>
        <div className="ml-auto flex items-center gap-4">
          <SearchBar placeholder="Search courses..." />
          {user && <ProfileMenu user={user} />}
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <CourseList />
        <ComingSoonCard />
      </main>
    </div>
  );
}

const CourseList = () => {
  const courses = [
    {
      title: 'Full-Stack Web Development',
      icon: 'https://images-dev-public.s3.amazonaws.com/course-resources/fullstack-web-dev/icons/course-icon.svg',
      description: '6-week bootcamp focused on full-stack web development',
      slug: 'fullstack-web-dev',
      active: true,
      coverImage:
        'https://images-dev-public.s3.amazonaws.com/course-resources/data-science-python/cover-image.png',
      sections: [
        {
          title: 'Web Development Fundamentals',
          slug: 'web-dev-fundamentals',
          icon: 'https://images-dev-public.s3.amazonaws.com/course-resources/fullstack-web-dev/icons/section-1-icon.svg',
        },
        {
          title: 'Frontend Development with React.js',
          slug: 'frontend-dev-react',
          icon: 'https://images-dev-public.s3.amazonaws.com/course-resources/fullstack-web-dev/icons/section-2-icon.svg',
        },
        {
          title: 'Backend Development with Express.js',
          slug: 'backend-dev-express',
          icon: 'https://images-dev-public.s3.amazonaws.com/course-resources/fullstack-web-dev/icons/section-3-icon.svg',
        },
        {
          title: 'Introduction to DevOps',
          slug: 'intro-to-devops',
          icon: 'https://images-dev-public.s3.amazonaws.com/course-resources/fullstack-web-dev/icons/section-4-icon.svg',
        },
      ],
    },
    {
      title: 'Data Science with Python',
      icon: 'https://images-dev-public.s3.amazonaws.com/course-resources/data-science-python/icons/course-icon.svg',
      description: '6-week bootcamp focused on data science with Python',
      slug: 'data-science-python',
      active: false,
      coverImage:
        'https://images-dev-public.s3.amazonaws.com/course-resources/data-science-python/cover-image.png',
      sections: [
        {
          title: 'Python Programming Fundamentals',
          slug: 'python-fundamentals',
          icon: 'https://images-dev-public.s3.amazonaws.com/course-resources/data-science-python/icons/section-1-icon.svg',
        },
        {
          title: 'Introduction to Machine Learning',
          slug: 'intro-to-machine-learning',
          icon: 'https://images-dev-public.s3.amazonaws.com/course-resources/data-science-python/icons/section-2-icon.svg',
        },
      ],
    },
  ];

  return (
    <>
      {courses.map((course) => (
        <Card
          key={course.title}
          className={cn('mx-6 my-2', course.active ? '' : 'bg-muted')}
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
              {course.sections.map((section) => (
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
          <CardFooter className="flex items-center bg-muted py-3">
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
        <div className="my-4">
          <SearchBar placeholder="Search courses..." inSheet />
        </div>
      </nav>
      <div className="mt-auto mb-4">
        <ProfileMenu user={user} inSheet />
      </div>
    </SheetMenu>
  );
};

const ComingSoonCard = () => {
  return (
    <Card className="mx-6 my-2 bg-muted">
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
