import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

export const dynamic = 'force-dynamic';

export const GET = handleAuth({
  login: handleLogin({
    returnTo: '/api/auth/silent',
  }),
  signup: handleLogin({
    authorizationParams: {
      screen_hint: 'signup',
    },
    returnTo: '/api/auth/logout',
  }),
  silent: async (req: NextApiRequest, res: NextApiResponse) => {
    const url = new URL(req.url || '');
    const redirect = url.searchParams.get('redirect') || 'app';
    return handleLogin({
      authorizationParams: { prompt: 'none' },
      returnTo: `/${redirect}`,
    })(req, res);
  },
});
