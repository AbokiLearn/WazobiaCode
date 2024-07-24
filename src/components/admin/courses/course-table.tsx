'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { deleteCourse } from '@/lib/client/course';
import { cn } from '@/lib/utils';
import { ICourse } from '@/types/db/course';

const DeleteCourseDialog = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-describedby="delete-course-description">
        <DialogTitle>Delete Course</DialogTitle>
        <DialogDescription id="delete-course-description">
          Are you sure you want to delete this course? This action cannot be
          undone.
        </DialogDescription>
        <DialogClose asChild>
          <Button
            variant="outline"
            className="hover:bg-muted hover:text-primary"
            onClick={onClose}
          >
            Cancel
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button onClick={onConfirm}>Delete</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

interface CourseTableProps {
  courses: ICourse[];
  refreshCourses: () => void;
  onEdit: (course: ICourse) => void;
}

export function CourseTable({
  courses,
  refreshCourses,
  onEdit,
}: CourseTableProps) {
  const [deleteCourseId, setDeleteCourseId] = useState<string | null>(null);

  const handleDelete = () => {
    if (deleteCourseId) {
      deleteCourse(deleteCourseId).then(() => {
        setDeleteCourseId(null);
        refreshCourses();
      });
    }
  };

  const headers = [
    'Course Title',
    'Enrolled Students',
    'Status',
    'Date Created',
  ];

  return (
    <div className="rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-primary font-semibold md:text-lg hover:bg-primary">
            {headers.map((header) => (
              <TableHead key={header} className="text-primary-foreground">
                {header}
              </TableHead>
            ))}
            <TableHead className="text-primary-foreground text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow
              key={course._id.toString()}
              className="hover:bg-muted md:text-[16px] border-b border-muted transition-colors"
            >
              <TableCell className="font-medium">
                <Link
                  href={`/admin/courses/${course.slug.toString()}`}
                  className="hover:underline"
                >
                  {course.title}
                </Link>
              </TableCell>
              <TableCell>{course.enrolled_students}</TableCell>
              <TableCell>
                <Badge
                  className={cn(
                    'text-gray-800',
                    course.active ? 'bg-green-400' : 'bg-red-400',
                  )}
                >
                  {course.active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(course.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-accent hover:text-primary"
                    onClick={() => onEdit(course)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-accent hover:text-primary"
                    onClick={() => setDeleteCourseId(course._id.toString())}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <DeleteCourseDialog
        isOpen={deleteCourseId !== null}
        onClose={() => setDeleteCourseId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
