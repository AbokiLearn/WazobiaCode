import { Button } from '@/components/ui/button';
import Image from 'next/image';
import LandingFAQ from '@/components/ui/landingPage/faq';
import Form from '@/components/ui/landingPage/form';

import { env } from '@/lib/config';

export default function LandingPage() {
  console.log('hello human');
  console.log(env.APP_URL);
  return (
    <>
      <div className="max-w-7xl mx-auto px-10 py-8 shadow-lg">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Image
              src="/logo.svg"
              alt="WazobiaCode Logo"
              width={40}
              height={40}
              className="mr-2 rounded-lg"
            />
            <h1 className="text-2xl font-bold">WazobiaCode</h1>
          </div>
          <MenuIcon className="h-6 w-6" />
        </header>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <Image
              alt="Coding Illustration"
              className="w-full h-auto rounded-lg"
              height="300"
              src="/student.jpg"
              style={{
                aspectRatio: '400/300',
                objectFit: 'cover',
              }}
              width="400"
            />
          </div>
          <div className="bg-[#FDE68A] p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">WazobiaCode</h2>
            <h3 className="text-xl font-semibold mb-4">
              Coding Summer Bootcamp
            </h3>
            <p className="mb-6">
              Learn to code at home - No experience required
            </p>
            <Button className="bg-[#F97316] text-white">Learn More</Button>
          </div>
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Why Aboki Code?</h2>
          <p className="mb-8">
            WazobiaCode is a free coding bootcamp that takes beginners and
            transforms them into full-stack web developers, equipping them with
            the tools to thrive in the developing tech industry. Our program is
            accessible via mobile device or laptops to ensure that location and
            resources are no barrier. Seize the opportunity, unlock your
            potential, and be a part of the digital revolution with WazobiaCode.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md">
              <CodeIcon className="h-6 w-6 text-gray-700" />
              <div>
                <h4 className="font-semibold">Gain Web Dev Skills</h4>
                <p className="text-sm text-gray-500">
                  Free & Fully online program
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md">
              <LaptopIcon className="h-6 w-6 text-gray-700" />
              <div>
                <h4 className="font-semibold">Build Real Projects</h4>
                <p className="text-sm text-gray-500">Showcase your skills</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md">
              <CommunityIcon className="h-6 w-6 text-gray-700" />
              <div>
                <h4 className="font-semibold">Join our Community</h4>
                <p className="text-sm text-gray-500">
                  A supportive community of fellow learners
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-15 md:py-20 lg:py-20">
          <LandingFAQ />
        </section>
        <section className="w-full">
          <Form />
        </section>
      </div>
      <footer className="max-w-7xl mx-auto bg-gray-900 text-white p-4">
        <div className="mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">© 2024 WazobiaCode. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

function CalendarIcon(props: any) {
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
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function LaptopIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
      <path d="M128 32C92.7 32 64 60.7 64 96V352h64V96H512V352h64V96c0-35.3-28.7-64-64-64H128zM19.2 384C8.6 384 0 392.6 0 403.2C0 445.6 34.4 480 76.8 480H563.2c42.4 0 76.8-34.4 76.8-76.8c0-10.6-8.6-19.2-19.2-19.2H19.2z" />
    </svg>
  );
}

function MenuIcon(props: any) {
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

function CodeIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
      <path d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z" />
    </svg>
  );
}

function CommunityIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
      <path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0H21.3C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3H405.3zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352H378.7C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7H154.7c-14.7 0-26.7-11.9-26.7-26.7z" />
    </svg>
  );
}
