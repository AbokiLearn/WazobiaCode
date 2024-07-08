import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  GradeProgressBar,
  type Progress,
} from '@/components/ui/app/progress-bar';
import { getUser } from '@/components/ui/app/profile-menu';
import { type ILecture } from '@/types/db/course';
import { getSectionWithLectures } from '@/lib/api';

interface SectionGrades {
  quizzes: Progress;
  assignments: Progress;
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
    assignments: {
      value: 69,
      max: 100,
    },
  };

  console.log(section._id);

  return (
    <>
      <h1 className="mx-6 my-2 text-center text-4xl text-foreground bg-background rounded-md p-2">
        {section.title}
      </h1>
      <GradesCard sectionGrades={sectionGrades} />
      {section.lectures.map((lecture) => (
        <LectureCard
          key={lecture.slug}
          courseSlug={courseSlug}
          sectionSlug={sectionSlug}
          lecture={lecture}
        />
      ))}
    </>
  );
}

const GradesCard = ({ sectionGrades }: { sectionGrades: SectionGrades }) => {
  return (
    <Card className="mx-6 my-2 px-2 py-2 md:px-4 md:py-4">
      <CardHeader>
        <CardTitle>Your Grades</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        <div className="flex flex-row gap-6">
          <GradeProgressBar
            submissionType="Quizzes"
            gradeProgress={sectionGrades.quizzes}
          />
          <GradeProgressBar
            submissionType="Assignments"
            gradeProgress={sectionGrades.assignments}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const LectureCard = ({
  courseSlug,
  sectionSlug,
  lecture,
}: {
  courseSlug: string;
  sectionSlug: string;
  lecture: ILecture;
}) => {
  function getYouTubeThumbnail(url: string): string {
    const videoId = url.split('v=')[1];
    return `https://img.youtube.com/vi/${videoId}/0.jpg`;
  }
  const thumbnailUrl = getYouTubeThumbnail(lecture.video_url);
  console.log(thumbnailUrl);

  return (
    <>
      <Card className="mx-6 my-2 px-2 py-2 md:px-4 md:py-4">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-grow md:pr-4">
            <CardHeader>
              <CardTitle>
                <Link
                  href={`/app/courses/${courseSlug}/${sectionSlug}/${lecture.slug}`}
                >
                  {`Lecture ${lecture.lecture_num}: ${lecture.title}`}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">{lecture.description}</p>
            </CardContent>
          </div>
          <div className="mt-4 md:mt-0 md:flex-shrink-0">
            <Link href={lecture.video_url}>
              <Image
                src={thumbnailUrl}
                alt={`Thumbnail for ${lecture.title}`}
                width={200}
                height={150}
                className="rounded-md shadow-md object-cover"
              />
            </Link>
          </div>
        </div>
      </Card>
    </>
  );
};
