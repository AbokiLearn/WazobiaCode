import Sidebar from '@/components/ui/lesson/sidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col md:flex-row py-12 px-4 md:px-6">
      <Sidebar />
      <div className="lesson w-full md:w-3/4 pl-0 md:pl-6">{children}</div>
    </main>
  );
}
