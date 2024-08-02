"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface Lecture {
  name: string;
  grade: number;
}

interface Section {
  name: string;
  lectures: Lecture[];
  average: number;
}

interface Course {
  name: string;
  grade: number;
  expanded: boolean;
  sections: Section[];
}

const GradesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([
    {
      name: "Introduction to React",
      grade: 92,
      expanded: true,
      sections: [
        {
          name: "React Basics",
          lectures: [
            { name: "JSX and Elements", grade: 98 },
            { name: "Components and Props", grade: 92 },
          ],
          average: 95,
        },
        {
          name: "State and Lifecycle",
          lectures: [
            { name: "useState Hook", grade: 90 },
            { name: "useEffect Hook", grade: 88 },
          ],
          average: 89,
        },
      ],
    },
    {
      name: "Advanced JavaScript",
      grade: 88,
      expanded: false,
      sections: [],
    },
  ]);

  const overallGrade: number = 90.0;

  const toggleCourseExpansion = (index: number): void => {
    setCourses(
      courses.map((course, i) =>
        i === index ? { ...course, expanded: !course.expanded } : course,
      ),
    );
  };

  return (
    <div className="p-6 bg-background">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Grades</h1>
      </header>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Overall Grade</span>
              <span className="bg-primary text-white text-sm py-1 px-2 rounded">
                {overallGrade.toFixed(1)}%
              </span>
            </CardTitle>
          </CardHeader>
        </Card>

        {courses.map((course, index) => (
          <Card key={index}>
            <CardHeader>
              <div
                className="cursor-pointer"
                onClick={() => toggleCourseExpansion(index)}
              >
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center">
                    {course.expanded ? (
                      <ChevronDown size={20} />
                    ) : (
                      <ChevronRight size={20} />
                    )}
                    <span className="ml-2">{course.name}</span>
                  </div>
                  <span className="bg-primary text-white text-sm py-1 px-2 rounded">
                    {course.grade}%
                  </span>
                </CardTitle>
              </div>
            </CardHeader>
            {course.expanded && (
              <CardContent>
                {course.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="mb-4">
                    <h3 className="font-semibold mb-2">{section.name}</h3>
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-left">Lecture</th>
                          <th className="text-right">Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.lectures.map((lecture, lectureIndex) => (
                          <tr key={lectureIndex}>
                            <td>{lecture.name}</td>
                            <td className="text-right">
                              <span className="bg-primary text-white text-sm py-1 px-2 rounded">
                                {lecture.grade}%
                              </span>
                            </td>
                          </tr>
                        ))}
                        <tr className="font-semibold">
                          <td>Section Average</td>
                          <td className="text-right">{section.average}%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))}
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

// Reusable Card components
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => (
  <div
    className={`bg-card text-card-foreground border border-border rounded-lg ${className}`}
  >
    {children}
  </div>
);

interface CardHeaderProps {
  children: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children }) => (
  <div className="p-4 border-b border-muted">{children}</div>
);

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => (
  <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>
);

interface CardContentProps {
  children: React.ReactNode;
}

const CardContent: React.FC<CardContentProps> = ({ children }) => (
  <div className="p-4">{children}</div>
);

export default GradesPage;
