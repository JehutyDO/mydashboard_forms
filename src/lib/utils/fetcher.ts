// src/lib/utils/fetcher.ts

export interface FetcherOptions {
  method?: string;
  headers?: HeadersInit;
  body?: Record<string, unknown> | unknown[];
}

export async function fetcher<T>(
  url: string,
  options?: FetcherOptions
): Promise<T> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiToken = process.env.NEXT_PUBLIC_API_TOKEN;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL no está configurada");
  }

  if (!apiToken) {
    throw new Error("NEXT_PUBLIC_API_TOKEN no está configurada");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiToken}`,
    ...(options?.headers || {}),
  };

  const config: RequestInit = {
    method: options?.method || 'GET',
    headers,
  };

  if (options?.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${apiUrl}${url}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({})) as { message?: string; error?: string };
    throw new Error(
      errorData.message || 
      errorData.error || 
      `Error ${response.status}: ${response.statusText}`
    );
  }

  return response.json();
}
