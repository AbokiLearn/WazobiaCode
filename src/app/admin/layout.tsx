import { Sidebar, SidebarMobile } from '@/components/admin/sidebar';
import { Header } from '@/components/admin/header';
import { Footer } from '@/components/ui/footer';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header>
        <SidebarMobile triggerClassName="xl:hidden" />
      </Header>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar className="xl:block" />
        <div className="flex flex-col flex-1 w-full md:w-[calc(100%-300px)]">
          <main className="flex-1 bg-background overflow-y-auto">
            <div className="h-full overflow-y-auto p-4">{children}</div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
