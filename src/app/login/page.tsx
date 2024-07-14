import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Login() {
  return (
    <>
      <main className="flex flex-col md:flex-row py-12 px-4 md:px-6 justify-center items-center">
        <div className="w-full max-w-md shadow-lg bg-gray-200 rounded-lg p-6">
          <h2 className="text-3xl font-bold">Log In</h2>
          <form className="mt-6 space-y-6">
            <div>
              <label className="sr-only" htmlFor="username">
                Username
              </label>
              <Input id="username" placeholder="Username" type="text" />
            </div>
            <div>
              <label className="sr-only" htmlFor="password">
                Password
              </label>
              <Input id="password" placeholder="Password" type="password" />
            </div>
            <div className="flex justify-between items-center">
              <Button type="submit">Log In</Button>
              <Link
                className="font-medium text-indigo-600 hover:text-indigo-500"
                href="#"
              >
                Forgot Password?
              </Link>
            </div>
          </form>
          <p className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link
              className="underline font-medium text-indigo-600 hover:text-indigo-500"
              href="signup"
            >
              Sign up{' '}
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
