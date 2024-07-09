import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Document() {
  return (
    <>
      <h1 className="text-3xl font-bold">
        Introduction to Web Programming in Python
      </h1>
      <div className="flex space-x-2 mt-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          #python
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          #webdev
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          #flask
        </span>
      </div>
      <hr className="my-4" />

      <div className="aspect-w-16 aspect-h-9"></div>

      <p className="mt-6 text-sm text-gray-500">
        In this lesson, we will be introducing the concept of web programming
        using Python. We will cover topics such as HTTP, web server and client,
        and how to use the Flask framework to build a web application.
      </p>

      <pre className="p-4 mt-4 bg-gray-800 text-white rounded-md">
        <code>
          {`
          import flask
          app = flask.Flask(__name__)
          @app.route('/')
          def hello_world():
          return 'Hello, World!'
          `}
        </code>
      </pre>

      <h2 className="text-2xl font-bold mt-6">Quiz</h2>

      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold">Question 1</h3>
          <p className="text-sm text-gray-500">What is Flask in Python?</p>
          <div className="mt-4 space-y-2">
            <input id="option1" name="quiz" type="radio" value="option1" />
            <label htmlFor="option1">A library for math computations</label>
            <br />
            <input id="option2" name="quiz" type="radio" value="option2" />
            <label htmlFor="option2">A web framework</label>
            <br />
            <input id="option3" name="quiz" type="radio" value="option3" />
            <label htmlFor="option3">A graphics package</label>
          </div>
          <Button className="mt-4" type="submit">
            Submit Answer
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
