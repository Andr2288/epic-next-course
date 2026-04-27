import { NextRequest } from "next/server"

import { actions } from "@/data/actions"
import { services } from "@/data/services"

export const maxDuration = 150
export const dynamic = "force-dynamic"

function jsonError(message: string, status: number) {
  return new Response(
    JSON.stringify({
      error: { name: "Error", message, status },
    }),
    { status, headers: { "Content-Type": "application/json" } }
  )
}

export async function POST(req: NextRequest) {
  const user = await services.auth.getUserMeService()
  const token = await actions.auth.getAuthTokenAction()

  if (!user.success || !token) {
    return jsonError("Not authenticated", 401)
  }

  let body: { videoId?: string }
  try {
    body = (await req.json()) as { videoId?: string }
  } catch {
    return jsonError("Invalid JSON body", 400)
  }

  const videoId = body.videoId
  if (!videoId) {
    return jsonError("Missing videoId", 400)
  }

  try {
    const transcriptData = await services.summarize.generateTranscript(videoId)
    if (!transcriptData?.fullTranscript) {
      return jsonError("No transcript data found", 400)
    }

    return new Response(
      JSON.stringify({ data: transcriptData, error: null }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch transcript"
    return jsonError(message, 500)
  }
}
