import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { GradeProgressBar, type Progress } from '@/components/app/progress-bar';
import { getUser } from '@/components/app/profile-menu';
import { Badge } from '@/components/ui/badge';
import { type ILecture } from '@/types/db/course';
import { getSectionWithLectures } from '@/lib/api';
import { getYouTubeThumbnail } from '@/lib/utils';

interface SectionGrades {
  quizzes: Progress;
  homeworks: Progress;
}

export default async function Page({
  params,
}: {
  params: { courseSlug: string; sectionSlug: string };
}) {
  const { courseSlug, sectionSlug } = params;

  // TODO: Replace with `session = await auth()` and `user = session?.user`
  const user = getUser();
  const section = await getSectionWithLectures(courseSlug, sectionSlug);
  // const sectionGrades = await getSectionGrades(section._id, user.id);
  const sectionGrades = {
    quizzes: {
      value: 69,
      max: 100,
    },
    homeworks: {
      value: 69,
      max: 100,
    },
  };

  const GradesCard = () => {
    return (
      <Card className="bg-card text-card-foreground border-border">
        <CardContent className="flex flex-col">
          <div className="flex flex-row justify-between mt-4">
            <Link
              className="text-foreground hover:text-accent"
              href={`/app/submissions/?course=${courseSlug}&section=${sectionSlug}`}
            >
              <h3 className="font-semibold text-2xl">Your Grades</h3>
            </Link>
          </div>
          <div className="flex flex-row gap-6">
            <GradeProgressBar
              submissionType="Quizzes"
              gradeProgress={sectionGrades.quizzes}
              href={`/app/submissions/?type=quiz&course=${courseSlug}&section=${sectionSlug}`}
            />
            <GradeProgressBar
              submissionType="Homeworks"
              gradeProgress={sectionGrades.homeworks}
              href={`/app/submissions/?type=homework&course=${courseSlug}&section=${sectionSlug}`}
            />
          </div>
        </CardContent>
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
      {user && <GradesCard />}
      {section.lectures.map((lecture) => (
        <LectureCard
          key={lecture.slug}
          courseSlug={courseSlug}
          sectionSlug={sectionSlug}
          lecture={lecture}
        />
      ))}
    </div>
  );
}

const LectureCard = ({
  courseSlug,
  sectionSlug,
  lecture,
}: {
  courseSlug: string;
  sectionSlug: string;
  lecture: ILecture;
}) => {
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
