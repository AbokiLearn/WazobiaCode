'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { toast } from 'sonner';
import Link from 'next/link';

import { GradeProgressBar, type Progress } from '@/components/app/progress-bar';
import { Card, CardContent } from '@/components/ui/card';

export const GradesCard = ({
  courseSlug,
  sectionSlug,
}: {
  courseSlug: string;
  sectionSlug: string;
}) => {
  const { user, error, isLoading } = useUser();

  if (error) {
    toast.error('Error fetching user');
  }

  // const sectionGrades = await getSectionGrades(section._id, user.id);
  const sectionGrades = {
    quizzes: {
      value: 69,
      max: 100,
    },
    homeworks: {
      value: 69,
      max: 100,
    },
  };

  return (
    user &&
    !isLoading &&
    !error && (
      <Card className="bg-card text-card-foreground border-border">
        <CardContent className="flex flex-col">
          <div className="flex flex-row justify-between mt-4">
            <Link
              className="text-foreground hover:text-accent"
              href={`/app/submissions/?course=${courseSlug}&section=${sectionSlug}`}
            >
              <h3 className="font-semibold text-2xl">Your Grades</h3>
            </Link>
          </div>
          <div className="flex flex-row gap-6">
            <GradeProgressBar
              submissionType="Quizzes"
              gradeProgress={sectionGrades.quizzes}
              href={`/app/submissions/?type=quiz&course=${courseSlug}&section=${sectionSlug}`}
            />
            <GradeProgressBar
              submissionType="Homeworks"
              gradeProgress={sectionGrades.homeworks}
              href={`/app/submissions/?type=homework&course=${courseSlug}&section=${sectionSlug}`}
            />
          </div>
        </CardContent>
      </Card>
    )
  );
};
