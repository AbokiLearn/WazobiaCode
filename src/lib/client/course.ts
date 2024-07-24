import {
  CourseResponse,
  SectionResponse,
  LectureResponse,
  ILecture,
  ICourse,
} from '@/types/db/course';
import { getData, postData, deleteData, patchData } from '@/lib/client';

export async function getCourse(
  courseSlug: string,
  includeSections: boolean = false,
  includeLectures: boolean = false,
): Promise<CourseResponse> {
  const { data } = await getData(
    `courses/${courseSlug}?sections=${includeSections}&lectures=${includeLectures}`,
    'no-store',
    'Failed to fetch course',
  );
  return data.course;
}

export async function getCourses(
  includeSections: boolean = false,
): Promise<CourseResponse[]> {
  const { data } = await getData(
    `/courses?sections=${includeSections}`,
    'no-store',
    'Failed to fetch courses',
  );
  return data.courses;
}

export async function getSectionWithLectures(
  courseSlug: string,
  sectionSlug: string,
): Promise<SectionResponse> {
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

export async function createCourse(data: Partial<ICourse>) {
  const { message } = await postData(
    '/courses',
    data,
    'Failed to create course',
  );
  return message;
}

export async function updateCourse(id: string, data: Partial<ICourse>) {
  const { message } = await patchData(
    '/courses',
    { id, ...data },
    'Failed to update course',
  );
  return message;
}

export async function deleteCourse(id: string) {
  const { message } = await deleteData(
    '/courses',
    id,
    'Failed to delete course',
  );
  return message;
}
