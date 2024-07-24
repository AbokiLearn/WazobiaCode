import axios from 'axios';

import { postData } from '@/lib/client';
import { getCourse } from './course';
import { env } from '@/lib/config';

export const getRecitationInviteRequests = async (
  courseSlug: string,
  message: string,
) => {
  const course = await getCourse(courseSlug);
  if (!course) {
    throw new Error('Course not found');
  }
  const course_id = course._id;
  const response = await postData(`/telegram/recitation-invites`, {
    course_id,
    message,
  });
  return response.data;
};

export const sendRecitationInvites = async (inviteRequests: any[]) => {
  console.log({ invites: inviteRequests });
  const response = await axios.post(
    `${env.TELEGRAM_API_URL}/send-invites`,
    { invites: inviteRequests },
    { headers: { 'X-API-Key': env.TELEGRAM_API_KEY } },
  );
  return response;
};
