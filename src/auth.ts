import NextAuth from 'next-auth';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { MongoClient } from 'mongodb';

import authConfig from '@/auth.config';
import { env } from '@/lib/config';

const client = new MongoClient(env.MONGODB_URI);
const clientPromise = client.connect();

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  secret: env.AUTH_SECRET,
  session: {
    strategy: 'database',
  },
  ...authConfig,
});
