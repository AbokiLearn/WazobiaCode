import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getUser, type User } from '@/components/app/profile-menu';
import {
  ProgressBar,
  GradeProgressBar,
  type Progress,
} from '@/components/app/progress-bar';
import { CourseWithSections } from '@/types/db/course';
import { getCourseWithSections } from '@/lib/api';
import { ISection } from '@/types/db/course';

interface CoursePageProps {
  params: { courseSlug: string };
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
    <>
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
    </>
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
    <Card
      key={course.title}
      className="mx-6 my-6 md:my-4 px-2 py-2 md:px-4 md:py-4"
    >
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
    <Card
      key={section.slug}
      className="mx-6 my-6 md:my-4 px-2 py-2 md:px-4 md:py-4"
    >
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
