import { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubmitQuestion } from '@/components/app/submit-question';
import { Quiz } from '@/components/app/quiz-content';
import VideoPlayer from '@/components/app/video-player';
import CustomMDX from '@/components/app/custom-mdx';
import { Badge } from '@/components/ui/badge';
import { getUser } from '@/components/app/profile-menu';
import { getLecture } from '@/lib/client/course';
import { IQuizAssignment } from '@/types/db/assignment';

export default async function Page({
  params,
}: {
  params: {
    courseSlug: string;
    sectionSlug: string;
    lectureSlug: string;
  };
}) {
  const { courseSlug, sectionSlug, lectureSlug } = params;
  const lecture = await getLecture(courseSlug, sectionSlug, lectureSlug);

  const user = await getUser();
  const isLoggedIn = user !== null;

  const LectureHeader = () => {
    return (
      <div className="flex flex-col mb-4">
        <h1 className="text-4xl font-bold">{lecture.title}</h1>
        <p className="text-lg text-muted-foreground mb-2">
          {lecture.description}
        </p>
        <div className="flex flex-row gap-2 mb-4">
          {lecture.tags.map((tag) => (
            // TODO: tags should link to a search page
            <Badge key={tag} className="bg-secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <hr className="border-muted" />
      </div>
    );
  };

  const LectureContent = () => {
    return (
      <>
        {/* TODO: add a loading state */}
        <div className="flex flex-col mb-4">
          <Suspense fallback={<div>Loading...</div>}>
            <VideoPlayer url={lecture.video_url} title={lecture.title} />
          </Suspense>
        </div>
        <CustomMDX source={lecture.content} />
        <hr className="border-muted mt-4" />
        {isLoggedIn && (
          <SubmitQuestion
            course_id={lecture.course_id}
            section_id={lecture.section_id}
            lecture_id={lecture._id}
            student_id={user.id}
          />
        )}
      </>
    );
  };

  const HomeworkContent = () => {
    return <div>Homework</div>;
  };

  return (
    <div className="p-6 lg:p-8 bg-background">
      <LectureHeader />
      <Tabs defaultValue="content">
        <div className="flex flex-row justify-center mb-4">
          <TabsList className={isLoggedIn ? '' : 'hidden'}>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
            <TabsTrigger value="homework">Homework</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="content">
          <LectureContent />
        </TabsContent>
        <TabsContent value="quiz">
          <Quiz
            quiz_id={lecture.quiz._id}
            course_id={lecture.course_id}
            section_id={lecture.section_id}
            lecture_id={lecture._id}
            questions={(lecture.quiz as IQuizAssignment).questions}
            user_id={user.id}
          />
        </TabsContent>
        <TabsContent value="homework">
          <HomeworkContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
