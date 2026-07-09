export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if(!res.ok) throw new Error(`API ERROR [${url}]: ${res.status}`);

  const data = await res.json();
  return data;
}
