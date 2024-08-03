'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StudentTable } from '@/components/admin/students/student-table';
import { getStudents } from '@/lib/client/students';
import { IUserMetadata } from '@/types/db/user-metadata';

export default function StudentsContent() {
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
    <>
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
      {/* Sheet component code here */}
    </>
  );
}
