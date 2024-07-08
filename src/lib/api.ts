import { env } from '@/lib/config';
import { CourseWithSections } from '@/types/db/course';

const APP_URL = env.APP_URL;

export const getEndpoint = (endpoint: string) => {
  return `${APP_URL}/api/${endpoint}`;
};

export async function getCourseWithSections(
  courseSlug: string,
): Promise<CourseWithSections> {
  const course = await fetch(getEndpoint(`/courses/${courseSlug}`), {
    cache: 'no-store',
  })
    .then((res) => res.json())
    .catch((err) => {
      throw new Error('Failed to fetch course');
    });
  return course;
}

export async function getCoursesWithSections(): Promise<CourseWithSections[]> {
  const res = await fetch(getEndpoint('/courses'), {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch courses');
  }
  const data = await res.json();
  return data;
}
