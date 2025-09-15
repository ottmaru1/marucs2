import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let text: string = '';
    let errorData: any = null;
    
    try {
      // 응답 내용을 텍스트로 먼저 읽기
      text = await res.text();
      
      // JSON 파싱 시도
      if (text) {
        errorData = JSON.parse(text);
      }
    } catch {
      // JSON 파싱 실패 시 text 그대로 사용
    }
    
    if (errorData) {
      // 409 오류의 경우 특별 처리 (동기화 필요 경고)
      if (res.status === 409 && errorData.needsSync) {
        const error = new Error(errorData.message || errorData.error) as any;
        error.status = res.status;
        error.data = errorData;
        // 컴포넌트에서 error.needsSync로 접근할 수 있도록 추가
        error.needsSync = errorData.needsSync;
        error.currentDefault = errorData.currentDefault;
        error.newDefault = errorData.newDefault;
        error.fileCount = errorData.fileCount;
        throw error;
      }
      
      // 다른 JSON 오류 응답
      const error = new Error(errorData.error || errorData.message || res.statusText) as any;
      error.status = res.status;
      error.data = errorData;
      throw error;
    } else {
      // JSON이 아닌 경우 기존 방식
      throw new Error(`${res.status}: ${text || res.statusText}`);
    }
  }
}

export async function apiRequest(
  url: string,
  options: {
    method: string;
    body?: unknown;
    headers?: Record<string, string>;
  } = { method: "GET" }
): Promise<any> {
  const res = await fetch(url, {
    method: options.method,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return await res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
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
