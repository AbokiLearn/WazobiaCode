import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
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
import {
  ProfileMenu,
  getUser,
  type User,
} from '@/components/ui/app/profile-menu';
import { SidebarNav, SheetNav } from '@/components/ui/app/navigation';
import {
  ProgressBar,
  GradeProgressBar,
  type Progress,
} from '@/components/ui/app/progress-bar';
import { CourseWithSections } from '@/types/db/course';
import { getCourseWithSections } from '@/lib/api';
import { ISection } from '@/types/db/course';

interface CoursePageProps {
  params: { courseSlug: string };
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { courseSlug } = params;
  const course = await getCourseWithSections(courseSlug);

  return {
    title: `${course.title} | WazobiaCode`,
    description: course.description,
  };
}

export default async function Page({ params }: CoursePageProps) {
  const { courseSlug } = params;

  // TODO: Replace with `session = await auth()` and `user = session?.user`
  const user = getUser();
  const course = await getCourseWithSections(courseSlug);
  // const courseProgress = await getCourseProgress(courseSlug, user.id);
  const courseProgress = {
    value: 69,
    max: 100,
  };

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b bg-muted px-4 lg:h-[60px] lg:px-6">
        <SheetNav course={course} />
        <HeaderLogo />
        <h2 className="font-semibold sm:flex sm:text-xl lg:text-2xl">
          {course.title}
        </h2>
        <div className="ml-auto flex items-center gap-4">
          <SearchBar placeholder="Search courses..." />
          {user && <ProfileMenu user={user} />}
        </div>
      </header>
      <main className="flex flex-1 bg-muted-foreground">
        <SidebarNav course={course} />
        <div className="flex flex-1 flex-col p-4 lg:gap-6 lg:p-6">
          <CourseOverviewCard
            user={user}
            course={course}
            courseProgress={courseProgress}
          />
          {course.sections
            .filter((section) => section.section_num > 0)
            .map((section) => (
              <SectionOverviewCard
                key={section.slug}
                courseSlug={courseSlug}
                section={section}
              />
            ))}
        </div>
      </main>
    </div>
  );
}

const CourseProgressBar = ({
  courseProgress,
}: {
  courseProgress: Progress;
}) => {
  return (
    <ProgressBar
      label="Course Progress"
      value={courseProgress.value}
      max={courseProgress.max}
      color="bg-blue-500"
      className="mt-4 mb-2"
    />
  );
};

const CourseOverviewCard = ({
  user,
  course,
  courseProgress,
}: {
  user: User;
  course: CourseWithSections;
  courseProgress: Progress;
}) => {
  return (
    <Card key={course.title} className="mx-6 my-2 px-4 py-4 md:px-6 md:py-6">
      <CardHeader>
        <CardTitle>Course Overview</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-row">
        <div className="flex flex-col">
          <p className="text-foreground">{course.overview}</p>
          {user && (
            <>
              <CourseProgressBar courseProgress={courseProgress} />
              <div className="flex flex-row gap-6">
                <GradeProgressBar
                  submissionType="Quizzes"
                  gradeProgress={courseProgress}
                />
                <GradeProgressBar
                  submissionType="Assignments"
                  gradeProgress={courseProgress}
                />
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const SectionOverviewCard = ({
  courseSlug,
  section,
}: {
  courseSlug: string;
  section: ISection;
}) => {
  return (
    <Card key={section.slug} className="mx-6 my-2 px-4 py-4 md:px-6 md:py-6">
      <CardHeader>
        <div className="flex flex-row items-center gap-2">
          <Image
            src={section.icon}
            alt={section.title}
            width={32}
            height={32}
          />
          <CardTitle>
            <Link href={`/app/courses/${courseSlug}/${section.slug}`}>
              {section.title}
            </Link>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-row">
        <p className="text-foreground">{section.description}</p>
      </CardContent>
    </Card>
  );
};
