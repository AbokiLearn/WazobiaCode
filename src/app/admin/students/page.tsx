'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

import { StudentTable } from '@/components/admin/students/student-table';

import { getStudents } from '@/lib/client/students';
import { IUserMetadata } from '@/types/db/user-metadata';

export const dynamic = 'force-dynamic';

export default function StudentsPage() {
  const [editingStudent, setEditingStudent] = useState<IUserMetadata | null>(
    null,
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [students, setStudents] = useState<IUserMetadata[]>([]);
  const [recitationFilter, setRecitationFilter] = useState<string | undefined>(
    undefined,
  );

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const recitation = searchParams.get('recitation') || undefined;
    setRecitationFilter(recitation);
    getStudents(recitation).then(setStudents);
  }, [searchParams]);

  const removeRecitationFilter = () => {
    router.push('/admin/students');
  };

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
      {recitationFilter && (
        <div className="mb-4">
          <Badge className="text-sm">
            Recitation: {recitationFilter}
            <button
              onClick={removeRecitationFilter}
              className="ml-2 hover:text-destructive"
            >
              <X size={14} />
            </button>
          </Badge>
        </div>
      )}
      <div className="bg-card rounded-lg shadow">
        <StudentTable students={students} />
      </div>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {editingStudent ? 'Edit Student' : 'New Student'}
            </SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}
