import qs from "qs"

import { api } from "@/data/data-api"
import { getStrapiURL } from "@/lib/utils"
import type { TStrapiResponse, TSummary } from "@/types"

const baseUrl = getStrapiURL()

export async function saveSummaryService(
  summaryData: { title: string; content: string; videoId: string },
  authToken: string
): Promise<TStrapiResponse<TSummary>> {
  const query = qs.stringify(
    { populate: "*" },
    { encodeValuesOnly: true }
  )
  const url = new URL("/api/summaries", baseUrl)
  url.search = query

  const payload = { data: summaryData }
  return api.post<TSummary, typeof payload>(url.href, payload, {
    authToken,
    timeoutMs: 30_000,
  })
}
