import { getData, postData, patchData } from '@/lib/client';
import { IAssignment } from '@/types/db/assignment';

export async function getAssignments(
  courseId?: string,
  sectionId?: string,
  lectureId?: string,
  populate_lecture?: boolean,
  populate_section?: boolean,
  populate_course?: boolean,
): Promise<IAssignment[]> {
  let endpoint = '/assignments';
  const params = new URLSearchParams();
  if (courseId) params.append('courseId', courseId);
  if (sectionId) params.append('sectionId', sectionId);
  if (lectureId) params.append('lectureId', lectureId);
  if (populate_lecture) params.append('populate_lecture', 'true');
  if (populate_section) params.append('populate_section', 'true');
  if (populate_course) params.append('populate_course', 'true');

  if (params.toString()) {
    endpoint += `?${params.toString()}`;
  }

  const { data } = await getData(
    endpoint,
    'no-store',
    'Failed to fetch assignments',
  );
  return data.assignments;
}

export async function getAssignment(id: string) {
  const { data } = await getData(
    `/assignments/${id}`,
    'no-store',
    'Failed to fetch assignment',
  );
  return data;
}

export async function createAssignment(data: Partial<IAssignment>) {
  const { data: responseData } = await postData(
    '/assignments',
    data,
    'Failed to create assignment',
  );
  return responseData.assignment;
}

export async function updateAssignment(id: string, data: Partial<IAssignment>) {
  const { data: responseData } = await patchData(
    `/assignments?id=${id}`,
    data,
    'Failed to update assignment',
  );
  return responseData.assignment;
}
