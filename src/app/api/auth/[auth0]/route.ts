import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  login: handleLogin({
    returnTo: '/app',
  }),
  signup: handleLogin({
    authorizationParams: {
      screen_hint: 'signup',
    },
    returnTo: '/app',
  }),
});
