import { Suspense } from 'react';
import StudentsContent from './client-side';

export default function StudentsPage() {
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
      <Suspense fallback={<div>Loading...</div>}>
        <StudentsContent />
      </Suspense>
    </div>
  );
}
