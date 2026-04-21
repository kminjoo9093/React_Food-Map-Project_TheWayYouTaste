const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export async function apiFetch(url, options = {}) {
  const res = await fetch(`${BASE_URL}${url}`, {
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
