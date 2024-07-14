'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { toast } from 'sonner';
import { ProgressBar, GradeProgressBar } from '@/components/app/progress-bar';

export const CourseProgressIndicator = ({
  courseSlug,
}: {
  courseSlug: string;
}) => {
  const { user, error, isLoading } = useUser();

  if (error) {
    toast.error('Error fetching user');
  }

  // const courseProgress = await getCourseProgress(courseSlug, user.id);
  const courseProgress = {
    value: 69,
    max: 100,
  };

  const CourseProgressBar = () => {
    return (
      <ProgressBar
        label="Course Progress"
        value={courseProgress.value}
        max={courseProgress.max}
        color="bg-accent"
        className="mt-4 mb-2"
      />
    );
  };

  return (
    user &&
    !isLoading &&
    !error && (
      <>
        <CourseProgressBar />
        <div className="flex flex-row gap-8">
          <GradeProgressBar
            submissionType="Quizzes"
            gradeProgress={courseProgress}
            href={`/app/submissions/?type=quiz&course=${courseSlug}`}
          />
          <GradeProgressBar
            submissionType="Homeworks"
            gradeProgress={courseProgress}
            href={`/app/submissions/?type=homework&course=${courseSlug}`}
          />
        </div>
      </>
    )
  );
};
