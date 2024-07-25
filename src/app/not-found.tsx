'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const router = useRouter();

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
            <CardTitle>404 - Page Not Found</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            We&apos;re sorry, but the page you&apos;re looking for doesn&apos;t
            exist or has been moved.
          </p>
          <p className="text-sm text-gray-600">
            Please check the URL or navigate back to the home page.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push('/')} className="w-full">
            Go to Home Page
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
