'use client';

import { type JSONContent } from 'novel';
import { useState } from 'react';
import { toast } from 'sonner';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { LectureEditorTab } from '@/components/admin/courses/lecture-editor';
import { Lectures } from '@/components/admin/courses/lectures';

import { updateLecture } from '@/lib/client/course';
import { ISection, ILecture } from '@/types/db/course';

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
      setEditingLecture(null);
      toast.success('Lecture content saved');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save lecture content');
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
            <div className="flex flex-row justify-center items-center mb-4">
              <TabsList>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger
                  value="homework"
                  disabled={!editingLecture.has_homework}
                >
                  Homework
                </TabsTrigger>
                <TabsTrigger
                  value="quizzes"
                  disabled={!editingLecture.has_quiz}
                >
                  Quizzes
                </TabsTrigger>
              </TabsList>
            </div>
            <LectureEditorTab
              lecture={editingLecture}
              saveLectureContent={saveLectureContent}
            />
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
