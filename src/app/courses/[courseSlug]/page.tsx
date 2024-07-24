import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { CourseProgressIndicator } from '@/components/app/courses/course-progress';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getCourse } from '@/lib/client/course';
import { ISection } from '@/types/db/course';

interface CoursePageProps {
  params: { courseSlug: string };
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { courseSlug } = params;
  const course = await getCourse(courseSlug);
  return {
    title: course.title,
  };
}

export const dynamic = 'force-dynamic';

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseSlug } = params;

  const course = await getCourse(courseSlug, true);

  return (
    <div className="m-4 md:m-6 space-y-6">
      <div className="flex flex-row items-center justify-center">
        <h2 className="font-semibold text-foreground text-center text-2xl md:text-3xl">
          {course.title}
        </h2>
      </div>

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
          <div className="flex flex-col w-full">
            <p className="text-justify">{course.description}</p>
            <CourseProgressIndicator courseSlug={course.slug} />
          </div>
        </CardContent>
      </Card>

      {course.sections!.map((section) => (
        <SectionOverviewCard
          key={section.slug}
          courseSlug={courseSlug}
          section={section}
        />
      ))}
    </div>
  );
}

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
