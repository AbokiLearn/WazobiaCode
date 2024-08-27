import { Metadata } from 'next';
import { AssignmentList } from '@/components/admin/grading/assignment-list';

export const metadata: Metadata = {
  title: 'Grading | Dashboard',
  description: 'Grade your students submissions',
};

export default function Page() {
  return <AssignmentList />;
}
