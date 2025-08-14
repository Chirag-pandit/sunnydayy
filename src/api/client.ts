const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

// set a static "guest" user for now. Replace with real auth when ready.
export const DEFAULT_USER_ID = "guest";

export async function api<T>(
  path: string,
  options: RequestInit = {},
  extraQuery: Record<string, string> = {}
): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  // pass userId as query (also supported via header)
  url.searchParams.set("userId", DEFAULT_USER_ID);
  for (const [k, v] of Object.entries(extraQuery)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      "x-user-id": DEFAULT_USER_ID,
      ...(options.headers || {})
    },
    ...options
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}
