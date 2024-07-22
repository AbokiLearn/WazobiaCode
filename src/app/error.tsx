'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { UserRole } from '@/types/auth';
import { env } from '@/lib/config';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { user, isLoading } = useUser();

  let isInstructor = false;
  if (!isLoading && user) {
    const userRoles = (user[`${env.AUTH0_NAMESPACE}/roles`] as string[]) || [];
    isInstructor = userRoles.includes(UserRole.INSTRUCTOR);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[450px]">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Image
              className="rounded-lg"
              src="/logo.svg"
              width={48}
              height={48}
              alt="logo"
            />
            <CardTitle>Oops! Something went wrong</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            We apologize for the inconvenience. An error has occurred while
            processing your request.
          </p>
          {isInstructor && (
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <h4 className="text-red-800 font-semibold mb-2">
                Error Details:
              </h4>
              <p className="text-red-700 text-sm whitespace-pre-wrap">
                {error.message}
              </p>
              {error.stack && (
                <>
                  <h5 className="text-red-800 font-semibold mt-2 mb-1">
                    Stack Trace:
                  </h5>
                  <pre className="text-red-700 text-xs overflow-x-auto">
                    {error.stack}
                  </pre>
                </>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={() => reset()} className="w-full">
            Try again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
