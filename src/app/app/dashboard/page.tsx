import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const CourseProgressIndicator = ({ courseSlug }: { courseSlug: string }) => {
  // Dummy progress indicator
  return (
    <div className="mt-4">
      <div className="bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: "45%" }}
        ></div>
      </div>
      <p className="text-sm mt-2">Course Progress: 45%</p>
    </div>
  );
};

export default function DashboardPage() {
  // Dummy course data
  const course = {
    title: "Introduction to Web Development",
    description:
      "Learn the basics of HTML, CSS, and JavaScript to build modern web applications.",
    slug: "intro-web-dev",
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <h2 className="text-xl font-semibold mb-4">Section Completion</h2>

      <Card
        key={course.title}
        className="bg-card text-card-foreground border-border"
      >
        <CardHeader>
          <CardTitle className="pb-2 border-b border-muted">
            {course.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-row">
          <div className="flex flex-col w-full">
            <p className="text-justify">{course.description}</p>
            <CourseProgressIndicator courseSlug={course.slug} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
