import type { TStrapiResponse } from "@/types"

type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

type ApiOptions<P = Record<string, unknown>> = {
  method: HTTPMethod
  payload?: P
  timeoutMs?: number
  authToken?: string
}

async function apiWithTimeout(
  input: RequestInfo,
  init: RequestInit = {},
  timeoutMs = 8000
): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(input, {
      ...init,
      signal: controller.signal,
    })
    return response
  } finally {
    clearTimeout(timeout)
  }
}

export async function apiRequest<T = unknown, P = Record<string, unknown>>(
  url: string,
  options: ApiOptions<P>
): Promise<TStrapiResponse<T>> {
  const { method, payload, timeoutMs = 8000, authToken } = options

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`
  }

  try {
    const response = await apiWithTimeout(
      url,
      {
        method,
        headers,
        cache: "no-store",
        body:
          method === "GET" || method === "DELETE"
            ? undefined
            : JSON.stringify(payload ?? {}),
      },
      timeoutMs
    )

    if (method === "DELETE") {
      return response.ok
        ? { data: true as T, success: true, status: response.status }
        : {
            error: {
              status: response.status,
              name: "Error",
              message: "Failed to delete resource",
            },
            success: false,
            status: response.status,
          }
    }

    const raw = await response.text()
    const trimmed = raw?.trim() ?? ""
    let data: Record<string, unknown> | null = null

    if (trimmed) {
      try {
        data = JSON.parse(trimmed) as Record<string, unknown>
      } catch {
        return {
          error: {
            status: response.status,
            name: "ParseError",
            message: "Invalid JSON in response (empty or not JSON).",
          },
          success: false,
          status: response.status,
        } as TStrapiResponse<T>
      }
    } else if (!response.ok) {
      return {
        error: {
          status: response.status,
          name: "Error",
          message: response.statusText || "Request failed (empty body)",
        },
        success: false,
        status: response.status,
      } as TStrapiResponse<T>
    } else {
      data = {}
    }

    if (!response.ok) {
      const err = data.error
      if (err && typeof err === "object" && "message" in err) {
        return {
          error: err as NonNullable<TStrapiResponse<null>["error"]>,
          success: false,
          status: response.status,
        }
      }
      return {
        error: {
          status: response.status,
          name:
            err && typeof err === "object" && "name" in err
              ? String((err as { name?: string }).name)
              : "Error",
          message:
            err && typeof err === "object" && "message" in err
              ? String((err as { message?: string }).message)
              : response.statusText || "An error occurred",
        },
        success: false,
        status: response.status,
      }
    }

    const responseData = data.data ? data.data : data
    const rawMeta = data.meta
    const responseMeta =
      rawMeta &&
      typeof rawMeta === "object" &&
      rawMeta !== null &&
      "pagination" in rawMeta
        ? (rawMeta as TStrapiResponse<T>["meta"])
        : undefined
    return {
      data: responseData as T,
      meta: responseMeta,
      success: true,
      status: response.status,
    }
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      return {
        error: {
          status: 408,
          name: "TimeoutError",
          message: "The request timed out. Please try again.",
        },
        success: false,
        status: 408,
      } as TStrapiResponse<T>
    }

    console.error(`Network or unexpected error on ${method} ${url}:`, error)
    return {
      error: {
        status: 500,
        name: "NetworkError",
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
      success: false,
      status: 500,
    } as TStrapiResponse<T>
  }
}

export const api = {
  get: <T>(
    url: string,
    options: { timeoutMs?: number; authToken?: string } = {}
  ) => apiRequest<T>(url, { method: "GET", ...options }),

  post: <T, P = Record<string, unknown>>(
    url: string,
    payload: P,
    options: { timeoutMs?: number; authToken?: string } = {}
  ) => apiRequest<T, P>(url, { method: "POST", payload, ...options }),

  put: <T, P = Record<string, unknown>>(
    url: string,
    payload: P,
    options: { timeoutMs?: number; authToken?: string } = {}
  ) => apiRequest<T, P>(url, { method: "PUT", payload, ...options }),

  patch: <T, P = Record<string, unknown>>(
    url: string,
    payload: P,
    options: { timeoutMs?: number; authToken?: string } = {}
  ) => apiRequest<T, P>(url, { method: "PATCH", payload, ...options }),

  delete: <T>(
    url: string,
    options: { timeoutMs?: number; authToken?: string } = {}
  ) => apiRequest<T>(url, { method: "DELETE", ...options }),
}
