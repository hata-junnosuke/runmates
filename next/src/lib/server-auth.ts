import { cookies } from "next/headers";

export async function getAuthStatus() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const client = cookieStore.get("client")?.value;
  const uid = cookieStore.get("uid")?.value;

  return !!(token && client && uid);
}

export async function getAuthTokens() {
  const cookieStore = await cookies();
  return {
    token: cookieStore.get("access_token")?.value,
    client: cookieStore.get("client")?.value,
    uid: cookieStore.get("uid")?.value,
  };
}
 