import Image from 'next/image';

import { PageHeader } from '@/components/landing-page/page-header';
import { LearnMore } from '@/components/landing-page/learn-more';
import LandingFAQ from '@/components/landing-page/faq';
import Form from '@/components/landing-page/form';
import { Footer } from '@/components/ui/footer';

export default function LandingPage() {
  return (
    <>
      <div className="max-w-7xl md:mx-auto px-4 md:px-10 py-8 scroll-smooth">
        <PageHeader />
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
          <div className="bg-[#F3F4F6] p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">WazobiaCode</h2>
            <h3 className="text-xl font-semibold mb-4">
              Coding Summer Bootcamp
            </h3>
            <p className="mb-6">
              Learn to code at home - No experience required
            </p>
            <LearnMore />
          </div>
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Why Wazobia Code?</h2>
          <p className="mb-8">
            WazobiaCode is a free coding bootcamp that takes beginners and
            transforms them into full-stack web developers, equipping them with
            the tools to thrive in the developing tech industry. Our program,
            which is completely free of charge, starts on [DATE]. It is
            accessible via mobile device or laptops to ensure that location and
            resources are no barrier. Your journey towards become a developer
            starts here.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md">
              <CodeIcon className="h-6 w-6 text-gray-700" />
              <div>
                <h4 className="font-semibold">Free Web Dev Training</h4>
                <p className="text-sm text-gray-500">
                  100% free online program
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md">
              <TrophyIcon className="h-6 w-6 text-gray-700" />
              <div>
                <h4 className="font-semibold">Create & Compete</h4>
                <p className="text-sm text-gray-500">
                  Win prizes as you build projects
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md">
              <BadgeIcon className="h-6 w-6 text-gray-700" />
              <div>
                <h4 className="font-semibold">Skills + Certificates</h4>
                <p className="text-sm text-gray-500">
                  Prove your coding proficiency
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-15 md:py-20 lg:py-20">
          <LandingFAQ id="faq-section" />
        </section>
        <section className="w-full">
          <Form />
        </section>
      </div>
      <Footer />
    </>
  );
}

function CodeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
      <path d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z" />
    </svg>
  );
}

function BadgeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path d="M211 7.3C205 1 196-1.4 187.6 .8s-14.9 8.9-17.1 17.3L154.7 80.6l-62-17.5c-8.4-2.4-17.4 0-23.5 6.1s-8.5 15.1-6.1 23.5l17.5 62L18.1 170.6c-8.4 2.1-15 8.7-17.3 17.1S1 205 7.3 211l46.2 45L7.3 301C1 307-1.4 316 .8 324.4s8.9 14.9 17.3 17.1l62.5 15.8-17.5 62c-2.4 8.4 0 17.4 6.1 23.5s15.1 8.5 23.5 6.1l62-17.5 15.8 62.5c2.1 8.4 8.7 15 17.1 17.3s17.3-.2 23.4-6.4l45-46.2 45 46.2c6.1 6.2 15 8.7 23.4 6.4s14.9-8.9 17.1-17.3l15.8-62.5 62 17.5c8.4 2.4 17.4 0 23.5-6.1s8.5-15.1 6.1-23.5l-17.5-62 62.5-15.8c8.4-2.1 15-8.7 17.3-17.1s-.2-17.4-6.4-23.4l-46.2-45 46.2-45c6.2-6.1 8.7-15 6.4-23.4s-8.9-14.9-17.3-17.1l-62.5-15.8 17.5-62c2.4-8.4 0-17.4-6.1-23.5s-15.1-8.5-23.5-6.1l-62 17.5L341.4 18.1c-2.1-8.4-8.7-15-17.1-17.3S307 1 301 7.3L256 53.5 211 7.3z" />
    </svg>
  );
}

function TrophyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
      <path d="M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z" />
    </svg>
  );
}
