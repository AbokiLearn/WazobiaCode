import { ManagementClient } from 'auth0';
import { env } from '@/lib/config';

/**
 * Get a management client for the Auth0 API
 * @returns The management client
 */
export const getManagementClient = async () => {
  return new ManagementClient({
    domain: env.AUTH0_DOMAIN,
    clientId: env.AUTH0_M2M_CLIENT_ID,
    clientSecret: env.AUTH0_M2M_CLIENT_SECRET,
  });
};
