import { env } from '@/lib/config';
import {
  CourseWithSections,
  SectionWithLectures,
  ILecture,
} from '@/types/db/course';

const getEndpoint = (endpoint: string) => {
  return `${env.APP_URL}/api/${endpoint}`;
};

const getData = async (
  endpoint: string,
  cache: RequestCache,
  errorMessage: string,
) => {
  const data = await fetch(getEndpoint(endpoint), {
    cache,
  })
    .then((res) => res.json())
    .catch((err) => {
      throw new Error(errorMessage);
    });
  return data;
};

export async function getCourseWithSections(
  courseSlug: string,
): Promise<CourseWithSections> {
  const { data } = await getData(
    `courses/${courseSlug}`,
    'no-store',
    'Failed to fetch course',
  );
  console.log(data);
  return data.course;
}

export async function getCoursesWithSections(): Promise<CourseWithSections[]> {
  const { data } = await getData(
    'courses',
    'no-store',
    'Failed to fetch courses',
  );
  return data.courses;
}

export async function getSectionWithLectures(
  courseSlug: string,
  sectionSlug: string,
): Promise<SectionWithLectures> {
  const { data } = await getData(
    `courses/${courseSlug}/${sectionSlug}`,
    'no-store',
    'Failed to fetch section',
  );
  return data.section;
}

export async function getLecture(
  courseSlug: string,
  sectionSlug: string,
  lectureSlug: string,
): Promise<ILecture> {
  const { data } = await getData(
    `courses/${courseSlug}/${sectionSlug}/${lectureSlug}`,
    'no-store',
    'Failed to fetch lecture',
  );
  return data.lecture;
}
