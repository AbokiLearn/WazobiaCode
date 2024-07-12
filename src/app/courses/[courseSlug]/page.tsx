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
    <div className="m-4 md:m-6 space-y-6">
      <div className="flex flex-row items-center justify-center">
        <h2 className="font-semibold text-foreground text-center text-2xl md:text-3xl">
          {course.title}
        </h2>
      </div>
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
  );
}

const CourseOverviewCard = ({
  user,
  course,
  courseProgress,
}: {
  user: User;
  course: CourseWithSections;
  courseProgress: Progress;
}) => {
  const CourseProgressBar = () => {
    return (
      <ProgressBar
        label="Course Progress"
        value={courseProgress.value}
        max={courseProgress.max}
        color="bg-accent"
        className="mt-4 mb-2"
      />
    );
  };

  return (
    <Card
      key={course.title}
      className="bg-card text-card-foreground border-border"
    >
      <CardHeader>
        <CardTitle className="pb-2 border-b border-muted">
          Course Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-row">
        <div className="flex flex-col">
          <p className="text-justify">{course.overview}</p>
          {user && (
            <>
              <CourseProgressBar />
              <div className="flex flex-row gap-8">
                <GradeProgressBar
                  submissionType="Quizzes"
                  gradeProgress={courseProgress}
                  href={`/app/submissions/?type=quiz&course=${course.slug}`}
                />
                <GradeProgressBar
                  submissionType="Homeworks"
                  gradeProgress={courseProgress}
                  href={`/app/submissions/?type=homework&course=${course.slug}`}
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
      className="bg-card text-card-foreground border-border"
    >
      <CardHeader>
        <div className="flex flex-row items-center gap-2">
          <Image
            src={section.icon}
            alt={section.title}
            width={32}
            height={32}
            className="w-8 h-8 md:w-10 md:h-10"
          />
          <CardTitle className="text-lg md:text-xl">
            <Link
              href={`/courses/${courseSlug}/${section.slug}`}
              className="hover:text-accent"
            >
              {section.title}
            </Link>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-row">
        <p className="text-justify">{section.description}</p>
      </CardContent>
    </Card>
  );
};
