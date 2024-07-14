import Image from 'next/image';
import Link from 'next/link';

import { PageHeader } from '@/components/landing-page/page-header';
import {
  GoogleLogin,
  CredentialsSignup,
} from '@/components/landing-page/auth-forms';
import { Footer } from '@/components/ui/footer';

export default function SignUp() {
  return (
    <>
      <div className="w-full lg:h-[calc(110vh-8rem)] px-6 pt-4">
        <PageHeader isAuthPage />
        <div className="w-full lg:grid lg:grid-cols-2">
          <div className="flex items-center justify-center py-12">
            <div className="mx-auto grid w-[400px] gap-6">
              <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Sign Up</h1>
                <p className="text-muted-foreground">
                  Enter your information to create an account
                </p>
              </div>
              <div className="grid gap-4">
                <CredentialsSignup />
                <GoogleLogin />
              </div>
              <div className="mt-4 text-center text-md">
                Already have an account?{' '}
                <Link href="/login" className="underline">
                  Sign in
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

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
