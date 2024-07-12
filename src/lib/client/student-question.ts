import { getData } from '@/lib/client';

export async function submitStudentQuestion(questionData: {
  course_id: string;
  section_id: string;
  lecture_id: string;
  student_id: string;
  question: string;
}) {
  const response = await fetch('/api/students/questions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(questionData),
  });

  if (!response.ok) {
    throw new Error('Failed to submit question');
  }

  return response.json();
}

export async function getStudentQuestions(params: {
  courseId?: string;
  sectionId?: string;
  lectureId?: string;
}) {
  const queryString = new URLSearchParams(params).toString();
  return getData(
    `students/questions?${queryString}`,
    'no-store',
    'Failed to fetch student questions',
  );
}
