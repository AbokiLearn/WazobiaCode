import { model, models, Model } from 'mongoose';

import {
  AssignmentSchema,
  QuizAssignmentSchema,
  HomeworkAssignmentSchema,
} from '@/models/assignment';
import { CourseSchema, SectionSchema, LectureSchema } from '@/models/course';
import { FAQSchema } from '@/models/faq';
import { QuestionSchema } from '@/models/student-question';
import {
  SubmissionSchema,
  QuizSubmissionSchema,
  HomeworkSubmissionSchema,
} from '@/models/submission';
import { UserMetadataSchema } from '@/models/user-metadata';

import {
  IAssignment,
  IQuizAssignment,
  IHomeworkAssignment,
} from '@/types/db/assignment';
import { ICourse, ISection, ILecture } from '@/types/db/course';
import { IFAQ } from '@/types/db/faq';
import { IStudentQuestion } from '@/types/db/student-question';
import {
  ISubmission,
  IQuizSubmission,
  IHomeworkSubmission,
} from '@/types/db/submission';
import { IUserMetadata } from '@/types/db/user-metadata';

// Assignment
export const Assignment: Model<IAssignment> =
  models.Assignment || model('Assignment', AssignmentSchema);
export const QuizAssignment: Model<IQuizAssignment> =
  models.QuizAssignment ||
  Assignment.discriminator('QuizAssignment', QuizAssignmentSchema);
export const HomeworkAssignment: Model<IHomeworkAssignment> =
  models.HomeworkAssignment ||
  Assignment.discriminator('HomeworkAssignment', HomeworkAssignmentSchema);

// Course-related (Course, Section, Lecture)
export const Course: Model<ICourse> =
  models.Course || model('Course', CourseSchema);
export const Section: Model<ISection> =
  models.Section || model('Section', SectionSchema);
export const Lecture: Model<ILecture> =
  models.Lecture || model('Lecture', LectureSchema);

// FAQ
export const FAQ: Model<IFAQ> = models.FAQ || model('FAQ', FAQSchema);

// StudentQuestion
export const StudentQuestion: Model<IStudentQuestion> =
  models.StudentQuestion ||
  model('StudentQuestion', QuestionSchema, 'student_questions');

// Submission
export const Submission: Model<ISubmission> =
  models.Submission || model('Submission', SubmissionSchema);
export const QuizSubmission: Model<IQuizSubmission> =
  models.QuizSubmission ||
  Submission.discriminator('QuizSubmission', QuizSubmissionSchema);
export const HomeworkSubmission: Model<IHomeworkSubmission> =
  models.HomeworkSubmission ||
  Submission.discriminator('HomeworkSubmission', HomeworkSubmissionSchema);

// UserMetadata
export const UserMetadata: Model<IUserMetadata> =
  models.UserMetadata ||
  model('UserMetadata', UserMetadataSchema, 'user_metadata');
