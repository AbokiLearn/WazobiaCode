'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { toast } from 'sonner';

import { TabsList, TabsTrigger } from '@/components/ui/tabs';

import { ILecture } from '@/types/db/course';

export const LectureTabList = ({ lecture }: { lecture: ILecture }) => {
  const { user, error } = useUser();

  if (error) {
    toast.error('Failed to fetch user');
  }

  if (!user) {
    return null;
  }

  return (
    <TabsList className={user ? '' : 'hidden'}>
      <TabsTrigger value="content">Content</TabsTrigger>
      {/* <TabsTrigger value="quiz" disabled={!lecture.has_quiz}>
        Quiz
      </TabsTrigger> */}
      <TabsTrigger value="homework" disabled={!lecture.has_homework}>
        Homework
      </TabsTrigger>
    </TabsList>
  );
};
