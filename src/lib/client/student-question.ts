import { getData, postData } from '@/lib/client';

export async function submitStudentQuestion(questionData: {
  course_id: string;
  section_id: string;
  lecture_id: string;
  student_id: string;
  question: string;
}) {
  const response = await postData(
    '/students/questions',
    questionData,
    'Failed to submit question',
  );

  return response;
}

export async function getStudentQuestions(params: {
  courseId?: string;
  sectionId?: string;
  lectureId?: string;
}) {
  const queryString = new URLSearchParams(params).toString();
  return getData(
    `/students/questions?${queryString}`,
    'no-store',
    'Failed to fetch student questions',
  );
}
