import qs from "qs"
import type {
  TStrapiResponse,
  THomePage,
  TGlobal,
  TMetaData,
  TSummary,
} from "@/types"

import { actions } from "@/data/actions"
import { api } from "@/data/data-api"
import { services } from "@/data/services"
import { getStrapiURL } from "@/lib/utils"

const baseUrl = getStrapiURL()

async function getHomePageData(): Promise<TStrapiResponse<THomePage>> {
  const query = qs.stringify({
    populate: {
      blocks: {
        on: {
          "layout.hero-section": {
            populate: {
              image: {
                fields: ["url", "alternativeText"],
              },
              link: {
                populate: true,
              },
            },
          },
          "layout.features-section": {
            populate: {
              features: {
                populate: true,
              },
            },
          },
        },
      },
    },
  })

  const url = new URL("/api/home-page", baseUrl)
  url.search = query
  return api.get<THomePage>(url.href, { timeoutMs: 8000 })
}

async function getGlobalData(): Promise<TStrapiResponse<TGlobal>> {
  const query = qs.stringify({
    populate: [
      "header.logoText",
      "header.ctaButton",
      "footer.logoText",
      "footer.socialLink",
    ],
  })

  const url = new URL("/api/global", baseUrl)
  url.search = query
  return api.get<TGlobal>(url.href, { timeoutMs: 8000 })
}

async function getMetaData(): Promise<TStrapiResponse<TMetaData>> {
  const query = qs.stringify({
    fields: ["title", "description"],
  })

  const url = new URL("/api/global", baseUrl)
  url.search = query
  return api.get<TMetaData>(url.href, { timeoutMs: 8000 })
}

async function getSummaries(): Promise<TStrapiResponse<TSummary[]>> {
  const me = await services.auth.getUserMeService()
  if (!me.success || !me.data) {
    return {
      success: false,
      status: 401,
      error: { status: 401, name: "Unauthorized", message: "Not authorized" },
    }
  }
  const authToken = await actions.auth.getAuthTokenAction()
  if (!authToken) {
    return {
      success: false,
      status: 401,
      error: { status: 401, name: "Unauthorized", message: "Not authorized" },
    }
  }
  const query = qs.stringify(
    {
      filters: { userId: { $eq: me.data.documentId } },
      sort: ["createdAt:desc"],
    },
    { encodeValuesOnly: true }
  )
  const url = new URL("/api/summaries", baseUrl)
  url.search = query
  return api.get<TSummary[]>(url.href, { authToken, timeoutMs: 15_000 })
}

async function getSummaryByDocumentId(
  documentId: string
): Promise<TStrapiResponse<TSummary>> {
  const me = await services.auth.getUserMeService()
  if (!me.success || !me.data) {
    return {
      success: false,
      status: 401,
      error: { status: 401, name: "Unauthorized", message: "Not authorized" },
    }
  }
  const authToken = await actions.auth.getAuthTokenAction()
  if (!authToken) {
    return {
      success: false,
      status: 401,
      error: { status: 401, name: "Unauthorized", message: "Not authorized" },
    }
  }
  const url = new URL(`/api/summaries/${documentId}`, baseUrl)
  const res = await api.get<TSummary>(url.href, { authToken, timeoutMs: 15_000 })
  if (res.success && res.data && res.data.userId !== me.data.documentId) {
    return {
      success: false,
      status: 404,
      error: { status: 404, name: "NotFound", message: "Not found" },
    }
  }
  return res
}

export const loaders = {
  getHomePageData,
  getGlobalData,
  getMetaData,
  getSummaries,
  getSummaryByDocumentId,
}
