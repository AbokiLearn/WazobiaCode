'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaCalendar, FaTrophy, FaChevronRight } from 'react-icons/fa';

import { AssignmentTypeBadge } from '@/components/admin/grading/assignment-type';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { getAssignments } from '@/lib/client/assignment';
import { formatDate } from '@/lib/utils';

import { ICourse, ILecture } from '@/types/db/course';
import { IAssignment } from '@/types/db/assignment';

interface GroupedAssignments {
  [key: string]: IAssignment[];
}

export function AssignmentList() {
  const [assignments, setAssignments] = useState<GroupedAssignments>({});
  const [courses, setCourses] = useState<{ title: string; _id: string }[]>([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      const fetchedAssignments = await getAssignments(
        undefined,
        undefined,
        undefined,
        true,
        true,
        true,
      );
      console.log(fetchedAssignments);
      const assignments = fetchedAssignments.reduce(
        (acc: GroupedAssignments, assignment) => {
          if (assignment) {
            const { course_id } = assignment;
            if (!acc[course_id._id.toString()]) {
              acc[course_id._id.toString()] = [];
            }
            acc[course_id._id.toString()].push(assignment);
          }
          return acc;
        },
        {},
      );
      const courses = fetchedAssignments.map((assignment) => ({
        title: (assignment.course_id as ICourse).title,
        _id: assignment.course_id._id.toString(),
      }));
      setAssignments(assignments);
      setCourses(courses);
    };
    fetchAssignments();
  }, []);

  return (
    <div className="flex flex-wrap items-start justify-center p-4">
      {Object.keys(assignments).map((courseId) => (
        <div key={courseId} className="w-full max-w-4xl">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            {courses.find((course) => course._id === courseId)?.title}
          </h2>
          <div className="space-y-8">
            {assignments[courseId].map((assignment) => (
              <>
                <Card className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  <div className="p-6 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <CardTitle className="text-xl font-bold text-gray-900 flex-grow">
                        <Link
                          href={`/admin/grading/submissions?assignment_id=${assignment._id}`}
                          key={assignment._id.toString()}
                        >
                          {(assignment.lecture_id as ILecture).title}
                        </Link>
                      </CardTitle>
                      <Link
                        href={`/admin/grading/submissions?assignment_type=${assignment.type}`}
                        key={assignment._id.toString()}
                      >
                        <AssignmentTypeBadge
                          type={assignment.type}
                          className="text-sm"
                        />
                      </Link>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <FaCalendar className="mr-2 text-gray-400" />
                      <span>Due: {formatDate(assignment.due_date)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaTrophy className="mr-2 text-gray-400" />
                      <span>Max Score: {assignment.max_score}</span>
                    </div>
                    {/* TODO: Add submission count */}
                  </div>
                  <Link
                    href={`/admin/grading/submissions?assignment_id=${assignment._id}`}
                    key={assignment._id.toString()}
                  >
                    <div className="bg-gray-50 px-6 py-3 flex justify-end items-center text-blue-600 hover:text-accent">
                      <span className="text-sm font-medium">View Details</span>
                      <FaChevronRight className="ml-2" />
                    </div>
                  </Link>
                </Card>
              </>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
