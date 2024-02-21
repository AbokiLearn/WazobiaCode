import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <main className="flex flex-col md:flex-col py-12 px-4 md:px-6">
        {/* Programming Languages */}
        <div
          className="w-full md:w-3/5 pr-0 md:pr-6"
          style={{ margin: '0 15%' }}
        >
          <h2 className="text-4xl font-bold mb-4 text-left pl-4">
            Programming Language Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {/* Each language card */}
            <div className=" border rounded-lg shadow p-4">
              <Link href={'/lesson'}>
                <h3 className="text-lg font-semibold">Python</h3>
                <p className="text-sm">Perfect for beginners</p>
              </Link>
            </div>
            <div className=" border rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold">JavaScript</h3>
              <p className="text-sm">Web development</p>
            </div>
            <div className=" border rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold">Java</h3>
              <p className="text-sm">Enterprise applications</p>
            </div>
            <div className=" border rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold">C++</h3>
              <p className="text-sm">System programming</p>
            </div>
          </div>
        </div>

        {/* Programming Stacks */}
        <div className="bg-white py-8" style={{ margin: '0 15%' }}>
          <h2 className="text-4xl font-bold mb-4 text-left pl-4">
            Software Stacks
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {/* Each language card */}
            <div className="border rounded-lg shadow p-4">
              <Link href={'/stacks'}>
                <h3 className="text-lg font-semibold">MERN Stack</h3>
                <p className="text-sm">Mongo Express React & Node</p>
              </Link>
            </div>
            <div className="border rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold">MERN Stack</h3>
              <p className="text-sm">Mongo Express React & Node</p>
            </div>
            <div className="border rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold">MERN Stack</h3>
              <p className="text-sm">Mongo Express React & Node</p>
            </div>
          </div>
        </div>
      </main>

      {/* Course Search */}
      <section
        className="flex flex-col items-start justify-start w-full py-12 md:py-24 lg:py-32"
        style={{ margin: '0 15%' }}
      >
        <div className="px-4 md:px-6">
          <h2 className="text-4xl font-bold mb-8 text-left pl-0">
            Find your course
          </h2>
          <div className="flex w-full max-w-lg items-center mt-6">
            <input
              type="text"
              placeholder="Search for a course"
              className="border-2 border-r-0 p-4 rounded-l-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none w-full"
            />
            <button
              type="submit"
              className="bg-black text-white p-4 rounded-r-md hover:bg-opacity-90 focus:outline-none"
            >
              Search
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            <div className=" border rounded-lg shadow p-8">
              <h3 className="text-lg font-semibold">Python for Beginners</h3>
              <p className="text-sm">Start learning Python today</p>
            </div>
            <div className=" border rounded-lg shadow p-8">
              <h3 className="text-lg font-semibold">Advanced JavaScript</h3>
              <p className="text-sm">Take your JS skills to the next level</p>
            </div>
            <div className=" border rounded-lg shadow p-8">
              <h3 className="text-lg font-semibold">Java 101</h3>
              <p className="text-sm">Discover the world of Java</p>
            </div>
            <div className=" border rounded-lg shadow p-8">
              <h3 className="text-lg font-semibold">Mastering C++</h3>
              <p className="text-sm">Learn C++ from scratch</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz of Day */}
      <section
        className="flex flex-col items-start justify-start w-full py-12 md:py-24 lg:py-32 mx-auto"
        style={{ maxWidth: '70%' }}
      >
        <div className="w-full px-4 md:px-6">
          <h2 className="text-4xl font-bold mb-8 text-left pl-0">
            Quiz of the Day
          </h2>
          <div className="bg-white p-8 shadow rounded-lg border-2 border-gray-300 w-full">
            <h3 className="text-lg font-semibold mb-4">Question 1</h3>
            <p className="text-sm text-gray-500 mb-6">What is Python?</p>
            <form className="space-y-4">
              <div className="flex items-center">
                <input
                  id="option1"
                  name="quiz"
                  type="radio"
                  value="option1"
                  className="mr-2"
                />
                <label htmlFor="option1" className="text-sm">
                  A snake
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="option2"
                  name="quiz"
                  type="radio"
                  value="option2"
                  className="mr-2"
                />
                <label htmlFor="option2" className="text-sm">
                  A programming language
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="option3"
                  name="quiz"
                  type="radio"
                  value="option3"
                  className="mr-2"
                />
                <label htmlFor="option3" className="text-sm">
                  A coffee brand
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="option4"
                  name="quiz"
                  type="radio"
                  value="option4"
                  className="mr-2"
                />
                <label htmlFor="option4" className="text-sm">
                  A type of car
                </label>
              </div>
              <button
                className="mt-8 bg-black text-white px-4 py-2 rounded-md hover:bg-opacity-90 focus:outline-none"
                type="submit"
              >
                Submit Answer
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer>
        <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          <Link href={'/faq'}>
            <h2 className="text-lg font-semibold">FAQs</h2>
          </Link> 
        </div>
      </footer>
    </>
  );
}
