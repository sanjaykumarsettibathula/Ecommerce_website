import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  // Only throw for non-2xx responses
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    
    // Handle authentication errors gracefully
    if (res.status === 401 || res.status === 403) {
      // Clear invalid token
      localStorage.removeItem('token');
      throw new Error(`Authentication failed: ${text}`);
    }
    
    throw new Error(`${res.status}: ${text}`);
  }
}

function getAuthHeaders(data?: unknown, customHeaders?: Record<string, string>) {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = { ...customHeaders };
  if (token && !headers['Authorization']) headers['Authorization'] = `Bearer ${token}`;
  if (data) headers['Content-Type'] = 'application/json';
  return headers;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  headers?: Record<string, string>
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: getAuthHeaders(data, headers),
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
      headers: getAuthHeaders(),
    });

    if (unauthorizedBehavior === "returnNull" && (res.status === 401 || res.status === 403)) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
