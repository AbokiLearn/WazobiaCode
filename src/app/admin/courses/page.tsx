'use client';

import { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

import { CourseFormValues } from '@/components/admin/courses/edit-course';
import { CourseTable } from '@/components/admin/courses/course-table';
import { EditCourse } from '@/components/admin/courses/edit-course';

import { createCourse, getCourses, updateCourse } from '@/lib/client/course';
import { uploadFiles } from '@/lib/client/files';
import { ICourse } from '@/types/db/course';

export const dynamic = 'force-dynamic';

export default function CoursesPage() {
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [courses, setCourses] = useState<ICourse[]>([]);

  useEffect(() => {
    getCourses().then(setCourses);
  }, []);

  const handleNewCourse = () => {
    setEditingCourse(null);
    setIsSheetOpen(true);
  };

  const handleEditCourse = (course: ICourse) => {
    setEditingCourse(course);
    setIsSheetOpen(true);
  };

  const handleSubmit = (data: CourseFormValues) => {
    const uploadPromises = [];
    let iconUrl = undefined;
    let coverImageUrl = undefined;

    // check if browser env
    const isBrowser = typeof window !== 'undefined';

    // upload icon if provided
    if (isBrowser && data.icon instanceof File) {
      uploadPromises.push(
        uploadFiles([data.icon], 'course-assets').then(([result]) => {
          iconUrl = result.data.file_url;
        }),
      );
    }

    // upload cover image if provided
    if (isBrowser && data.cover_image instanceof File) {
      uploadPromises.push(
        uploadFiles([data.cover_image], 'course-assets').then(([result]) => {
          coverImageUrl = result.data.file_url;
        }),
      );
    }

    // wait for uploads to complete
    Promise.all(uploadPromises)
      .then(() => {
        const courseData: Partial<ICourse> = {
          ...data,
          icon: iconUrl!,
          cover_image: coverImageUrl!,
        };

        if (editingCourse) {
          return updateCourse(editingCourse._id, courseData);
        } else {
          return createCourse(courseData);
        }
      })
      .then((result) => {
        if (result instanceof Error) {
          throw result;
        }
        toast.success(editingCourse ? 'Course updated' : 'Course created');
        return getCourses();
      })
      .then((updatedCourses) => {
        setCourses(updatedCourses);
        setIsSheetOpen(false);
        setEditingCourse(null);
      })
      .catch((error: any) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Courses</h1>
          <p className="text-muted-foreground mt-1">
            Manage and create courses
          </p>
        </div>
        <Button
          className="bg-primary border font-semibold text-primary-foreground hover:text-accent hover:border-accent"
          onClick={handleNewCourse}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> New Course
        </Button>
      </div>
      <div className="bg-card rounded-lg shadow">
        <CourseTable
          courses={courses}
          refreshCourses={() => getCourses().then(setCourses)}
          onEdit={handleEditCourse}
        />
      </div>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {editingCourse ? 'Edit Course' : 'New Course'}
            </SheetTitle>
          </SheetHeader>
          <EditCourse
            initialData={editingCourse || undefined}
            onSubmit={handleSubmit}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
