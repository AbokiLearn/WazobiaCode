import { redirect } from 'next/navigation';
import { SubmissionList } from '@/components/admin/grading/SubmissionList';
import { getAssignment } from '@/lib/client/assignment';
import { Suspense } from 'react';

import { IAssignment } from '@/types/db/assignment';

export default async function AssignmentGradingPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const assignmentId = searchParams.assignment_id as string | undefined;
  const assignmentType = searchParams.assignment_type as string | undefined;

  if (!assignmentId && !assignmentType) {
    redirect('/admin/grading');
  }

  let assignment: IAssignment | undefined;
  if (assignmentId) {
    assignment = await getAssignment(assignmentId);
  }

  return (
    <div className="container w-full">
      <h1 className="text-2xl font-bold mb-4">Grading Submissions</h1>
      <Suspense fallback={<div>Loading submissions...</div>}>
        <SubmissionList
          assignment={assignment}
          assignmentType={assignmentType}
        />
      </Suspense>
    </div>
  );
}
