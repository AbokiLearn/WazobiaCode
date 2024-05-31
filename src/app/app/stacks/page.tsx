import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CodepenIcon } from 'lucide-react';
import Link from 'next/link';

const Stacks = () => {
  return (
    <>
      <main className="flex flex-col md:flex-row py-12 px-4 md:px-6">
        <aside className="w-full md:w-1/4 pr-0 md:pr-6 space-y-2 bg-pastel-gray">
          <div className="flex items-center space-x-2 py-2 px-4">
            <CodepenIcon className="w-4 h-4" />
            <h2 className="text-lg font-bold">MERN</h2>
          </div>
          <h3 className="py-2 px-4 text-md font-semibold">HTML</h3>
          <Link
            className="block py-2 px-4 rounded-md bg-white text-sm font-medium"
            href="#"
          >
            Lesson 1: HTML Basics
          </Link>
          <Link
            className="block py-2 px-4 rounded-md bg-white text-sm font-medium"
            href="#"
          >
            Lesson 2: Advanced HTML
          </Link>
          <h3 className="py-2 px-4 text-md font-semibold">CSS</h3>
          <Link
            className="block py-2 px-4 rounded-md bg-white text-sm font-medium"
            href="#"
          >
            Lesson 1: CSS Basics
          </Link>
          <Link
            className="block py-2 px-4 rounded-md bg-white text-sm font-medium"
            href="#"
          >
            Lesson 2: Advanced CSS
          </Link>
          <h3 className="py-2 px-4 text-md font-semibold">Javascript</h3>
          <Link
            className="block py-2 px-4 rounded-md bg-white text-sm font-medium"
            href="#"
          >
            Lesson 1: Javascript Basics
          </Link>
          <Link
            className="block py-2 px-4 rounded-md bg-white text-sm font-medium"
            href="#"
          >
            Lesson 2: Advanced Javascript
          </Link>
        </aside>
        <div className="w-full md:w-3/4 pl-0 md:pl-6">
          <h1 className="text-3xl font-bold">
            HTML x React.js: An Introduction
          </h1>
          <div className="flex space-x-2 mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              #MERN
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              #HTML
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              #reactjs
            </span>
          </div>
          <hr className="my-4" />
          <div className="aspect-w-16 aspect-h-9">
            <div />
          </div>
          <p className="mt-6 text-sm text-gray-500">
            In this lesson, we will introduce the integration of HTML with
            React.js in the MERN stack. We will cover topics such as JSX,
            components, and how to use HTML elements in a React.js application.
          </p>
          <pre className="p-4 mt-4 bg-gray-800 text-white rounded-md">
            <code>
              import React from &#39;react&#39;; function App() return (
              <div>
                <h1>Hello, World!</h1>
              </div>
              {`
                          );
                        }
                        export default App;
                      `}
            </code>
          </pre>
          <h2 className="text-2xl font-bold mt-6">Quiz</h2>
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold">Question 1</h3>
              <p className="text-sm text-gray-500">
                What is a component in React?
              </p>
              <div className="mt-4 space-y-2">
                <input id="option1" name="quiz" type="radio" value="option1" />
                <label htmlFor="option1">A reusable piece of the UI</label>
                <br />
                <input id="option2" name="quiz" type="radio" value="option2" />
                <label htmlFor="option2">A programming language</label>
                <br />
                <input id="option3" name="quiz" type="radio" value="option3" />
                <label htmlFor="option3">A database</label>
              </div>
              <Button className="mt-4" type="submit">
                Submit Answer
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
};

export default Stacks;
