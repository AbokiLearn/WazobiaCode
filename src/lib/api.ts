import { env } from '@/lib/config';
import { ICourse, CourseWithSections } from '@/types/db/course';

const APP_URL = env.APP_URL;

export const getEndpoint = (endpoint: string) => {
  return `${APP_URL}/api/${endpoint}`;
};

export async function getCourse(courseSlug: string): Promise<ICourse> {
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
