import { cookies } from 'next/headers';

export interface AuthHeaders {
  'access-token'?: string;
  client?: string;
  uid?: string;
  'token-type'?: string;
}

export async function getAuthHeaders(): Promise<AuthHeaders> {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('access-token')?.value;
  const client = cookieStore.get('client')?.value;
  const uid = cookieStore.get('uid')?.value;

  if (accessToken && client && uid) {
    return {
      'access-token': accessToken,
      client: client,
      uid: uid,
      'token-type': 'Bearer',
    };
  }

  return {};
}
