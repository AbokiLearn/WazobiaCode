import { Recitations } from '@/components/admin/courses/recitations';
import { Sections } from '@/components/admin/courses/sections';
import { CourseCard } from '@/components/admin/courses/course-card';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';

import { getCourse } from '@/lib/client/course';

export default async function CoursePage({
  params,
}: {
  params: { courseSlug: string };
}) {
  const courseSlug = params.courseSlug;
  const course = await getCourse(courseSlug, true);

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Breadcrumbs />
        <h1 className="text-3xl font-bold text-foreground">Edit Course</h1>
      </div>
      <div className="flex flex-col w-full">
        <CourseCard course={course} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Sections courseSlug={courseSlug} />
          <Recitations courseSlug={courseSlug} />
        </div>
      </div>
    </div>
  );
}
