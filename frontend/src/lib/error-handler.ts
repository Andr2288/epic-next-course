import { notFound } from "next/navigation"
import type { TStrapiResponse } from "@/types"

export function handleApiError<T>(
  data: TStrapiResponse<T> | null | undefined,
  resourceName?: string
): void {
  if (!data) {
    throw new Error(`Failed to load ${resourceName || "resource"}`)
  }

  if (data?.error?.status === 404) {
    notFound()
  }

  if (!data?.success || !data?.data) {
    const errorMessage =
      data?.error?.message || `Failed to load ${resourceName || "resource"}`
    throw new Error(errorMessage)
  }
}

export function validateApiResponse<T>(
  data: TStrapiResponse<T> | null | undefined,
  resourceName?: string
): T {
  handleApiError(data, resourceName)
  return data!.data!
}
