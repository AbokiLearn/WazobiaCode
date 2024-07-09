import { AppFooter } from '@/components/app/footer';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <main className="flex-grow">{children}</main>
      <AppFooter />
    </div>
  );
}
