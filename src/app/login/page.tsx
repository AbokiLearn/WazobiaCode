import Image from 'next/image';
import Link from 'next/link';

import { GoogleLogin, CredentialsLogin } from '@/components/landing-page/auth';
import { PageHeader } from '@/components/landing-page/page-header';
import { Footer } from '@/components/ui/footer';

export default function LogIn() {
  return (
    <>
      <div className="w-full lg:h-[calc(110vh-8rem)] px-6 pt-4">
        <PageHeader isAuthPage />
        <div className="w-full lg:grid lg:grid-cols-2">
          <div className="flex items-center justify-center py-12">
            <div className="mx-auto grid w-[400px] gap-6">
              <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Login</h1>
                <p className="text-muted-foreground">
                  Enter your email below to login to your account
                </p>
              </div>
              <div className="grid gap-4">
                <CredentialsLogin />
                <GoogleLogin />
              </div>
              <div className="mt-4 text-center text-md">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="underline">
                  Sign up
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden bg-muted lg:block lg:h-[calc(100vh-10rem)]">
            <Image
              src="/student.jpg"
              alt="Image"
              width="1920"
              height="1080"
              className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
