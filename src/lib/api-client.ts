import { env } from '@/lib/config';
import {
  CourseWithSections,
  SectionWithLectures,
  ILecture,
} from '@/types/db/course';

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
  const data = await fetch(getEndpoint('/courses'), {
    cache: 'no-store',
  })
    .then((res) => res.json())
    .catch((err) => {
      throw new Error('Failed to fetch courses');
    });
  return data;
}

export async function getSectionWithLectures(
  courseSlug: string,
  sectionSlug: string,
): Promise<SectionWithLectures> {
  const data = await fetch(
    getEndpoint(`/courses/${courseSlug}/${sectionSlug}`),
    {
      cache: 'no-store',
    },
  )
    .then((res) => res.json())
    .catch((err) => {
      throw new Error('Failed to fetch section');
    });
  return data;
}

export async function getLecture(
  courseSlug: string,
  sectionSlug: string,
  lectureSlug: string,
): Promise<ILecture> {
  const lecture = await fetch(
    getEndpoint(`/courses/${courseSlug}/${sectionSlug}/${lectureSlug}`),
    {
      cache: 'no-store',
    },
  )
    .then((res) => res.json())
    .catch((err) => {
      throw new Error('Failed to fetch lecture');
    });
  return lecture;
}
