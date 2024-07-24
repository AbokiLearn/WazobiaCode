import {
  CourseResponse,
  SectionResponse,
  ILecture,
  ICourse,
  ISection,
} from '@/types/db/course';
import { IRecitationGroup } from '@/types/db/recitation-group';
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

export async function getSection(
  courseSlug: string,
  sectionSlug: string,
  includeLectures: boolean = false,
  includeLectureContent: boolean = false,
): Promise<ISection> {
  const { data } = await getData(
    `courses/${courseSlug}/sections?slug=${sectionSlug}&lectures=${includeLectures}&content=${includeLectureContent}`,
    'no-store',
    'Failed to fetch section',
  );
  return data.sections[0];
}

export async function getSections(
  courseSlug: string,
  includeLectures: boolean = false,
): Promise<SectionResponse[]> {
  const { data } = await getData(
    `courses/${courseSlug}/sections?lectures=${includeLectures}`,
    'no-store',
    'Failed to fetch sections',
  );
  return data.sections;
}

export async function createSection(
  courseSlug: string,
  data: Partial<ISection>,
) {
  const { message, data: responseData } = await postData(
    `courses/${courseSlug}/sections`,
    data,
    'Failed to create section',
  );
  return { message, section: responseData.section };
}

export async function updateSection(
  courseSlug: string,
  id: string,
  data: Partial<ISection>,
) {
  const { message, data: responseData } = await patchData(
    `courses/${courseSlug}/sections`,
    { id, ...data },
    'Failed to update section',
  );
  return { message, section: responseData.section };
}

export async function deleteSection(courseSlug: string, id: string) {
  const { message } = await deleteData(
    `courses/${courseSlug}/sections`,
    id,
    'Failed to delete section',
  );
  return message;
}

export async function getRecitationGroups(
  courseSlug: string,
  recitationId?: string,
): Promise<IRecitationGroup[]> {
  const url = `courses/${courseSlug}/recitations${
    recitationId ? `?id=${recitationId}` : ''
  }`;
  const { data } = await getData(
    url,
    'no-store',
    'Failed to fetch recitation groups',
  );
  return data.recitations;
}

export async function createRecitationGroup(
  courseSlug: string,
  data: Partial<IRecitationGroup>,
) {
  const { message, data: responseData } = await postData(
    `courses/${courseSlug}/recitations`,
    data,
    'Failed to create recitation group',
  );
  return { message, recitationGroup: responseData.recitationGroup };
}

export async function updateRecitationGroup(
  courseSlug: string,
  id: string,
  data: Partial<IRecitationGroup>,
) {
  const { message, data: responseData } = await patchData(
    `courses/${courseSlug}/recitations`,
    { id, ...data },
    'Failed to update recitation group',
  );
  return { message, recitationGroup: responseData.recitationGroup };
}

export async function deleteRecitationGroup(courseSlug: string, id: string) {
  const { message } = await deleteData(
    `courses/${courseSlug}/recitations`,
    id,
    'Failed to delete recitation group',
  );
  return message;
}
