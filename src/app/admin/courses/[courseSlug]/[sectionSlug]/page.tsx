import { Suspense } from 'react';
import { getSection } from '@/lib/client/course';
import { ISection } from '@/types/db/course';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';
import { SectionCard } from '@/components/admin/courses/section-card';
import { ClientSideContent } from './client-side';

export default async function CoursePage({
  params,
}: {
  params: { courseSlug: string; sectionSlug: string };
}) {
  const { courseSlug, sectionSlug } = params;
  const section: ISection | null = await getSection(
    courseSlug,
    sectionSlug,
    true,
    true,
  );

  if (!section) {
    return <div>Section not found</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Breadcrumbs />
        <h1 className="text-3xl font-bold text-foreground">Edit Section</h1>
      </div>
      <div className="flex flex-col w-full">
        <SectionCard section={section} />
        <Suspense fallback={<div>Loading...</div>}>
          <ClientSideContent
            courseSlug={courseSlug}
            sectionSlug={sectionSlug}
            section={section}
          />
        </Suspense>
      </div>
    </div>
  );
}
