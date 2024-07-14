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
      <TabsContent value="quiz">
        <Quiz
          quiz_id={lecture.quiz._id}
          course_id={lecture.course_id}
          section_id={lecture.section_id}
          lecture_id={lecture._id}
          questions={(lecture.quiz as IQuizAssignment).questions}
          user_id={user.id as string}
        />
      </TabsContent>
      <TabsContent value="homework">
        <Homework
          assignment_id={lecture.homework._id}
          course_id={lecture.course_id}
          section_id={lecture.section_id}
          lecture_id={lecture._id}
          student_id={user.id}
          homework={lecture.homework as IHomeworkAssignment}
        />
      </TabsContent>
    </>
  );
};
