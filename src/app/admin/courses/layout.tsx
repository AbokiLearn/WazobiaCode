import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Courses | Dashboard',
  description: 'Manage your courses',
};

export default function AdminCoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
