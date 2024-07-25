'use client';

import { useState, useEffect } from 'react';
import { type JSONContent } from 'novel';
import { toast } from 'sonner';

import { LectureEditorTab } from '@/components/admin/courses/lecture-editor';
import { SectionCard } from '@/components/admin/courses/section-card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Lectures } from '@/components/admin/courses/lectures';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';

import { getSection, updateLecture } from '@/lib/client/course';
import { ISection, ILecture } from '@/types/db/course';

export default function CoursePage({
  params,
}: {
  params: { courseSlug: string; sectionSlug: string };
}) {
  const [section, setSection] = useState<ISection | null>(null);
  const [editingLecture, setEditingLecture] = useState<ILecture | null>(null);

  const courseSlug = params.courseSlug;
  const sectionSlug = params.sectionSlug;

  useEffect(() => {
    getSection(courseSlug, sectionSlug, true, true).then(setSection);
  }, [courseSlug, sectionSlug]);

  if (!section) {
    return <div>Section not found</div>;
  }

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
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Breadcrumbs />
        <h1 className="text-3xl font-bold text-foreground">Edit Section</h1>
      </div>
      <div className="flex flex-col w-full">
        <SectionCard section={section} />
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
            <Tabs defaultValue="content" className="justify-center">
              <div className="flex flex-row justify-center items-center mb-4">
                <TabsList>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="homework">Homework</TabsTrigger>
                  <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                </TabsList>
              </div>
              <LectureEditorTab
                lecture={editingLecture}
                saveLectureContent={saveLectureContent}
              />
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
