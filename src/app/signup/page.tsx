import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const Signup = () => {
  return (
    <>
      <main className="flex flex-col md:flex-row py-12 px-4 md:px-6 justify-center items-center">
        <div className="w-full max-w-md shadow-lg bg-gray-200 rounded-lg p-6">
          <h2 className="text-3xl font-bold">Sign Up</h2>
          <form className="mt-6 space-y-6">
            <div>
              <label className="sr-only" htmlFor="username">
                Username
              </label>
              <Input id="username" placeholder="Username" type="text" />
            </div>
            <div>
              <label className="sr-only" htmlFor="email">
                Email
              </label>
              <Input id="email" placeholder="Email" type="email" />
            </div>
            <div>
              <label className="sr-only" htmlFor="password">
                Password
              </label>
              <Input id="password" placeholder="Password" type="password" />
            </div>
            <div>
              <label className="sr-only" htmlFor="dob">
                Date of Birth
              </label>
              <Input id="dob" placeholder="Date of Birth" type="date" />
            </div>
            <div>
              <Button type="submit">Sign Up</Button>
            </div>
          </form>
          <p className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link
              className="underline font-medium text-indigo-600 hover:text-indigo-500"
              href="login"
            >
              Sign in{' '}
            </Link>
          </p>
        </div>
      </main>
    </>
  );
};

export default Signup;
