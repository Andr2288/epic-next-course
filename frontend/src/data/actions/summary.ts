"use server"

import { getAuthTokenAction } from "@/data/actions/auth"
import { saveSummaryService } from "@/data/services/summary"
import type { TStrapiResponse, TSummary } from "@/types"

export async function createSummaryAction(payload: {
  title: string
  content: string
  videoId: string
}): Promise<TStrapiResponse<TSummary>> {
  const token = await getAuthTokenAction()
  if (!token) {
    return {
      success: false,
      status: 401,
      error: {
        status: 401,
        name: "Unauthorized",
        message: "Not authenticated",
      },
    }
  }
  return saveSummaryService(payload, token)
}
