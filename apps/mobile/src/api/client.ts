const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

let getToken: () => Promise<string | null> = async () => null;
export function registerGetToken(fn: typeof getToken) { getToken = fn; }

export async function api(path: string, opts: RequestInit = {}) {
  const token = await getToken();
  const headers: Record<string,string> = { 'Content-Type': 'application/json', ...(opts.headers as any) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...opts, headers });
  if (!res.ok) {
    const text = await res.text().catch(()=>'');
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}
