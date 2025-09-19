const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

// Manage a runtime userId; defaults to 'guest' until auth sets it.
let currentUserId = (typeof window !== 'undefined' && localStorage.getItem('user_id')) || 'guest';
export function setUserId(id: string) {
  currentUserId = id || 'guest';
  try { if (typeof window !== 'undefined') localStorage.setItem('user_id', currentUserId); } catch {}
}
export function getUserId() { return currentUserId; }

export async function api<T>(
  path: string,
  options: RequestInit = {},
  extraQuery: Record<string, string> = {}
): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  // pass userId as query (also supported via header)
  url.searchParams.set("userId", getUserId());
  // cache-busting to avoid 304 responses with empty body
  url.searchParams.set("_ts", Date.now().toString());
  for (const [k, v] of Object.entries(extraQuery)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      "x-user-id": getUserId(),
      "Cache-Control": "no-cache",
      "Pragma": "no-cache",
      ...(options.headers || {})
    },
    // Ensure the browser does not serve cached responses
    cache: "no-store",
    ...options
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}
