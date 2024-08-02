'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { toast } from 'sonner';

import { TabsContent } from '@/components/ui/tabs';
import { Homework } from '@/components/app/homework-content';
import { Quiz } from '@/components/app/quiz-content';

import { IQuizAssignment, IHomeworkAssignment } from '@/types/db/assignment';
import { ILecture } from '@/types/db/course';

export const AssignmentContents = ({ lecture }: { lecture: ILecture }) => {
  const { user, error, isLoading } = useUser();

  if (error) {
    toast.error('Failed to fetch user');
  }

  if (!user) {
    return null;
  }

  return (
    <>
      {lecture.has_quiz && lecture.quiz_id && (
        <TabsContent value="quiz">
          <Quiz
            quiz_id={lecture.quiz_id._id}
            course_id={lecture.course_id}
            section_id={lecture.section_id}
            lecture_id={lecture._id}
            questions={(lecture.quiz_id as IQuizAssignment).questions}
            user_id={user.sub as string}
          />
        </TabsContent>
      )}
      {lecture.has_homework && lecture.homework_id && (
        <TabsContent value="homework">
          <Homework
            assignment_id={lecture.homework_id._id}
            course_id={lecture.course_id}
            section_id={lecture.section_id}
            lecture_id={lecture._id}
            student_id={user.sub}
            homework={lecture.homework_id as IHomeworkAssignment}
          />
        </TabsContent>
      )}
    </>
  );
};
