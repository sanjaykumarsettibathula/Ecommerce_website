import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Get API URL from environment or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

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
  // Use proxy configuration for API requests
  const fullUrl = url.startsWith('http') ? url : url;
  
  console.log(`Making ${method} request to ${fullUrl}`);
  
  try {
    const res = await fetch(fullUrl, {
      method,
      headers: getAuthHeaders(data, headers),
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
      mode: 'cors'
    });
    
    console.log(`Response status: ${res.status}`);
    if (!res.ok) {
      console.error(`Error response: ${res.statusText}`);
    }
    
    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const fullUrl = queryKey[0] as string;
    const url = fullUrl.startsWith('http') ? fullUrl : `${API_BASE_URL}${fullUrl}`;
    
    console.log(`Query function making request to ${url}`);
    
    try {
      const res = await fetch(url, {
        method: 'GET',
        credentials: "include",
        headers: getAuthHeaders(),
        mode: 'cors'
      });
      
      console.log(`Query function response status: ${res.status}`);
      
      if (unauthorizedBehavior === "returnNull" && (res.status === 401 || res.status === 403)) {
        return null;
      }
      
      if (!res.ok) {
        console.error(`Query function error response: ${res.statusText}`);
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      console.error('Query function fetch error:', error);
      throw error;
    }
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
