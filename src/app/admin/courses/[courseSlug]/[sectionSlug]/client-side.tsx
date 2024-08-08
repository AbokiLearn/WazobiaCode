'use client';

import { type JSONContent } from 'novel';
import { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';

import { LectureEditorTab } from '@/components/admin/courses/lecture-editor';
import {
  HomeworkEditorTab,
  type HomeworkFormValues,
} from '@/components/admin/courses/homework-editor';
import { QuizEditorTab } from '@/components/admin/courses/quiz-editor';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lectures } from '@/components/admin/courses/lectures';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { updateLecture } from '@/lib/client/course';
import { updateAssignment } from '@/lib/client/assignment';
import { ISection, ILecture } from '@/types/db/course';
import { AssignmentType } from '@/types/db/assignment';
import { File as FileType } from '@/types';

export function ClientSideContent({
  courseSlug,
  sectionSlug,
  section,
}: {
  courseSlug: string;
  sectionSlug: string;
  section: ISection;
}) {
  const [editingLecture, setEditingLecture] = useState<ILecture | null>(null);

  const saveLectureContent = async ({
    content,
    json_content,
  }: {
    content: string;
    json_content: JSONContent;
  }) => {
    if (!editingLecture) return;

    try {
      const { lecture } = await updateLecture(
        courseSlug,
        sectionSlug,
        editingLecture._id.toString(),
        { content, json_content },
      );
      setEditingLecture(lecture);
      toast.success('Lecture content saved');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save lecture content');
    }
  };

  const saveLectureVideo = async (video_download_url: FileType) => {
    if (!editingLecture) return;

    try {
      const { lecture } = await updateLecture(
        courseSlug,
        sectionSlug,
        editingLecture._id.toString(),
        { video_download_url },
      );
      setEditingLecture(lecture);
      toast.success('Lecture video saved');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save lecture video');
    }
  };

  const saveHomework = async (
    homework_id: string,
    homework: HomeworkFormValues,
  ) => {
    if (!editingLecture || !editingLecture.has_homework) return;

    try {
      const data = { ...homework, type: AssignmentType.HOMEWORK };
      const updatedHomework = await updateAssignment(homework_id, data);
      toast.success('Homework saved');
      return updatedHomework;
    } catch (error) {
      console.error(error);
      toast.error('Failed to save homework');
    }
  };

  const saveQuiz = async (quiz_id: string, quiz: any) => {
    if (!editingLecture || !editingLecture.has_quiz) return;

    try {
      const updatedQuiz = await updateAssignment(quiz_id, quiz);
      toast.success('Quiz saved');
      return updatedQuiz;
    } catch (error) {
      console.error(error);
      toast.error('Failed to save quiz');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      <div className="lg:col-span-1">
        <Lectures
          courseSlug={courseSlug}
          sectionSlug={sectionSlug}
          setEditingLecture={setEditingLecture}
          editingLecture={editingLecture}
        />
      </div>
      <div className="lg:col-span-2">
        {editingLecture ? (
          <Tabs defaultValue="content" className="justify-center">
            <div className="flex flex-row justify-between items-center mb-4">
              <div className="flex flex-row items-center">
                <TabsList>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger
                    value="homework"
                    disabled={!editingLecture.has_homework}
                  >
                    Homework
                  </TabsTrigger>
                  <TabsTrigger value="quiz" disabled={!editingLecture.has_quiz}>
                    Quiz
                  </TabsTrigger>
                </TabsList>
              </div>
              <div className="flex flex-row items-center">
                <Button
                  className="hover:text-accent"
                  variant="link"
                  onClick={() => setEditingLecture(null)}
                >
                  <X />
                </Button>
              </div>
            </div>
            <Card className="w-full bg-card shadow">
              <LectureEditorTab
                lecture={editingLecture}
                saveLectureContent={saveLectureContent}
                saveLectureVideo={saveLectureVideo}
              />
              <HomeworkEditorTab
                lecture={editingLecture}
                saveHomework={saveHomework}
              />
              <QuizEditorTab lecture={editingLecture} saveQuiz={saveQuiz} />
            </Card>
          </Tabs>
        ) : (
          <Card className="w-full bg-card shadow">
            <CardContent className="flex items-center justify-center h-[400px]">
              <p className="text-muted-foreground text-lg">
                Select a lecture to edit
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
