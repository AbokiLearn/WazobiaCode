export enum UserRole {
  INSTRUCTOR = 'instructor',
  STUDENT = 'student',
}

export interface User {
  [key: `${string}/roles`]: UserRole[];
  given_name?: string;
  family_name?: string;
  nickname: string;
  name: string;
  picture: string;
  updated_at: string;
  email: string;
  email_verified: boolean;
  sub: string;
  sid: string;
}

export interface UserMetadata {
  first_name: string;
  last_name: string;
  phone_number: string;
}
