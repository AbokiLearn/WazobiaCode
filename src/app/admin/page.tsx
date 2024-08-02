import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Instructor Dashboard',
  description: 'Instructor Dashboard',
};

export default function Page() {
  redirect('/admin/courses');
}
