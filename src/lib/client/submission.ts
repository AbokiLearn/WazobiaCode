import { IQuizAnswer } from '@/types/db/submission';
import { postData } from '@/lib/client';

export async function submitQuiz(quizData: {
  quiz_id: string;
  course_id: string;
  section_id: string;
  lecture_id: string;
  student_id: string;
  answers: IQuizAnswer[];
}) {
  const submissionData = {
    assignment_id: quizData.quiz_id,
    student_id: quizData.student_id,
    course_id: quizData.course_id,
    section_id: quizData.section_id,
    lecture_id: quizData.lecture_id,
    type: 'quiz',
    answers: quizData.answers,
  };

  const response = await postData(
    '/submissions',
    submissionData,
    'Failed to submit quiz',
  );

  return response;
}

export async function submitHomework(homeworkData: {
  assignment_id: string;
  course_id: string;
  section_id: string;
  lecture_id: string;
  student_id: string;
  comments: string;
  submitted_files: string[];
}) {
  const submissionData = {
    assignment_id: homeworkData.assignment_id,
    student_id: homeworkData.student_id,
    course_id: homeworkData.course_id,
    section_id: homeworkData.section_id,
    lecture_id: homeworkData.lecture_id,
    type: 'homework',
    comments: homeworkData.comments,
    submitted_files: homeworkData.submitted_files,
  };

  const response = await postData(
    '/submissions',
    submissionData,
    'Failed to submit homework',
  );

  return response;
}
