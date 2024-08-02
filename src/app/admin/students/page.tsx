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

// import { StudentFormValues } from '@/components/admin/students/edit-student';
import { StudentTable } from '@/components/admin/students/student-table';
// import { EditStudent } from '@/components/admin/students/edit-student';

import { getStudents, updateStudent } from '@/lib/client/students';
import { IUserMetadata } from '@/types/db/user-metadata';

export const dynamic = 'force-dynamic';

export default function StudentsPage() {
  const [editingStudent, setEditingStudent] = useState<IUserMetadata | null>(
    null,
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [students, setStudents] = useState<IUserMetadata[]>([]);

  useEffect(() => {
    getStudents().then(setStudents);
  }, []);

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground mt-1">
            Manage and create student accounts
          </p>
        </div>
      </div>
      <div className="bg-card rounded-lg shadow">
        <StudentTable students={students} refreshStudents={() => {}} />
      </div>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {editingStudent ? 'Edit Student' : 'New Student'}
            </SheetTitle>
          </SheetHeader>
          {/* <EditStudent
            initialData={editingStudent || undefined}
            onSubmit={handleSubmit}
          /> */}
        </SheetContent>
      </Sheet>
    </div>
  );
}
