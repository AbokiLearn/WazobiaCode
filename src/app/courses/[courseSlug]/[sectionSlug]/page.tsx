import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { GradesCard } from '@/components/app/courses/grades-card';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type LectureResponse } from '@/types/db/course';
import { getSectionWithLectures } from '@/lib/client/course';
import { getYouTubeThumbnail } from '@/lib/utils';

interface SectionPageProps {
  params: { courseSlug: string; sectionSlug: string };
}

export async function generateMetadata({
  params,
}: SectionPageProps): Promise<Metadata> {
  const { courseSlug, sectionSlug } = params;

  try {
    const section = await getSectionWithLectures(courseSlug, sectionSlug);
    if (!section.active) {
      throw new Error('Section is not active');
    }
    return {
      title: section.title,
    };
  } catch (error) {
    notFound();
  }
}

export const dynamic = 'force-dynamic';

export default async function SectionPage({ params }: SectionPageProps) {
  const { courseSlug, sectionSlug } = params;

  const section = await getSectionWithLectures(courseSlug, sectionSlug);

  const LectureCard = ({ lecture }: { lecture: LectureResponse }) => {
    const thumbnailUrl = getYouTubeThumbnail(lecture.video_url);

    return (
      <Card className="bg-card text-card-foreground border-border overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 aspect-video relative">
            <Link href={lecture.video_url}>
              <Image
                src={thumbnailUrl}
                alt={`Thumbnail for ${lecture.title}`}
                layout="fill"
                objectFit="cover"
                className="rounded-t-md md:rounded-l-md md:rounded-t-none"
              />
            </Link>
          </div>
          <div className="p-6 md:w-2/3 space-y-4">
            <Link
              href={`/courses/${courseSlug}/${sectionSlug}/${lecture.slug}`}
              className="block"
            >
              <h3 className="text-xl font-semibold text-foreground hover:text-accent">
                {`Lecture ${lecture.lecture_num}: ${lecture.title}`}
              </h3>
            </Link>
            <p className="text-foreground text-sm">{lecture.description}</p>
            <div className="flex flex-wrap gap-2">
              {lecture.tags.map((tag) => (
                <Badge
                  key={tag}
                  className="bg-secondary text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="m-4 md:m-6 space-y-6">
      <div className="flex flex-row items-center justify-center">
        <h2 className="font-semibold text-foreground text-center text-xl sm:text-2xl md:text-3xl">
          {section.title}
        </h2>
      </div>
      <GradesCard courseSlug={courseSlug} sectionSlug={sectionSlug} />
      {section.lectures?.map((lecture) => {
        if (lecture.active) {
          return <LectureCard key={lecture.slug} lecture={lecture} />;
        }
      })}
    </div>
  );
}
