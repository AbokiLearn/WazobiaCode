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
import { ICourse } from '@/types/db/course';

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
    try {
      if (editingCourse) {
        // Update course
        updateCourse(editingCourse._id, data)
          .then(() => {
            toast.success('Course updated');
            getCourses().then(setCourses);
            setIsSheetOpen(false);
          })
          .catch((error: any) => {
            toast.error(error.message);
          });
      } else {
        // Create course
        createCourse(data)
          .then(() => {
            toast.success('Course created');
            getCourses().then(setCourses);
            setIsSheetOpen(false);
          })
          .catch((error: any) => {
            toast.error(error.message);
          });
      }
    } catch (error: any) {
      toast.error(error.message);
    }
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
        <SheetContent>
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
