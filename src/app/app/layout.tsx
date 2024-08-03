import { Sidebar, SidebarMobile } from '@/components/app/student/sidebar';
import { Header } from '@/components/admin/header';
import { Footer } from '@/components/ui/footer';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header>{/* <SidebarMobile /> */}</Header>
      <div className="flex flex-1 overflow-hidden">
        {/* <Sidebar /> */}
        <div className="flex flex-col flex-1 w-full md:w-[calc(100%-300px)]">
          <main className="flex-1 bg-background overflow-y-auto">
            <div className="h-full overflow-y-auto">{children}</div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
