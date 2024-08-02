import { getData, postData, deleteData, patchData } from '@/lib/client';
import { IUserMetadata } from '@/types/db/user-metadata';

export async function getStudents(
  recitation?: string,
): Promise<IUserMetadata[]> {
  const { data } = await getData(
    recitation ? `/students?recitation=${recitation}` : '/students',
    'no-store',
    'Failed to fetch students',
  );
  return data;
}

export async function createStudent(data: Partial<IUserMetadata>) {
  const { message } = await postData(
    '/students',
    data,
    'Failed to create student',
  );
  return message;
}

export async function updateStudent(id: string, data: Partial<IUserMetadata>) {
  const { message } = await patchData(
    '/students',
    { id, ...data },
    'Failed to update student',
  );
  return message;
}

export async function deleteStudent(id: string) {
  const { message } = await deleteData(
    '/students',
    id,
    'Failed to delete student',
  );
  return message;
}
