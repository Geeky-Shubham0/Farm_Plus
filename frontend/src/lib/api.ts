const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function request<TResponse>(
  path: string,
  method: HttpMethod,
  body?: unknown,
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<TResponse>;
}

export function postJson<TResponse>(path: string, body: unknown) {
  return request<TResponse>(path, 'POST', body);
}
