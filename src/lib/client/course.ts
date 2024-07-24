import {
  CourseWithSections,
  SectionWithLectures,
  ILecture,
} from '@/types/db/course';
import { getData } from '@/lib/client';

export async function getCourseWithSections(
  courseSlug: string,
): Promise<CourseWithSections> {
  const { data } = await getData(
    `courses/${courseSlug}`,
    'no-store',
    'Failed to fetch course',
  );
  return data.course;
}

export async function getCoursesWithSections(): Promise<CourseWithSections[]> {
  const { data } = await getData(
    'courses?sections=true',
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
