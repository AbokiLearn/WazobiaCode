import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { GradeProgressBar, type Progress } from '@/components/app/progress-bar';
import { getUser } from '@/components/app/profile-menu';
import { Badge } from '@/components/ui/badge';
import { type ILecture } from '@/types/db/course';
import { getSectionWithLectures } from '@/lib/api';
import { getYouTubeThumbnail } from '@/lib/utils';

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

  const GradesCard = () => {
    return (
      <Card className="mx-6 my-6 md:my-4 px-2 py-2 md:px-4 md:py-4">
        <CardHeader>
          <CardTitle>Your Grades</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
          <div className="flex flex-row gap-6">
            <GradeProgressBar
              submissionType="Quizzes"
              gradeProgress={sectionGrades.quizzes}
              href={`/app/submissions/quiz/${courseSlug}/${sectionSlug}`}
            />
            <GradeProgressBar
              submissionType="Assignments"
              gradeProgress={sectionGrades.assignments}
              href={`/app/submissions/assignment/${courseSlug}/${sectionSlug}`}
            />
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <h1 className="mx-6 my-2 text-center text-4xl text-foreground bg-background rounded-md p-2">
        {section.title}
      </h1>
      <GradesCard />
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
    <>
      <Card className="mx-6 my-6 md:my-4 px-2 py-2 md:px-4 md:py-4">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-grow md:pr-4">
            <CardHeader>
              <CardTitle>
                <Link
                  href={`/courses/${courseSlug}/${sectionSlug}/${lecture.slug}`}
                >
                  {`Lecture ${lecture.lecture_num}: ${lecture.title}`}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">{lecture.description}</p>
            </CardContent>
            <CardFooter className="flex flex-row gap-2">
              {lecture.tags.map((tag) => (
                <Badge key={tag} className="bg-secondary">
                  {tag}
                </Badge>
              ))}
            </CardFooter>
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
