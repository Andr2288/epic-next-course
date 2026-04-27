import { NextRequest } from "next/server"

import { actions } from "@/data/actions"
import { services } from "@/data/services"

export const maxDuration = 150
export const dynamic = "force-dynamic"

const TEMPLATE = `
You are an expert content analyst and copywriter. Create a comprehensive summary following this exact structure:

## Quick Overview
Start with a 2-3 sentence description of what this content covers.

## Key Topics Summary
Summarize the content using 5 main topics. Write in a conversational, first-person tone as if explaining to a friend.

## Key Points & Benefits
List the most important points and practical benefits viewers will gain.

## Detailed Summary
Write a complete Summary including:
- Engaging introduction paragraph
- Timestamped sections (if applicable)
- Key takeaways section
- Call-to-action

---
Format your response using clear markdown headers and bullet points. Keep language natural and accessible throughout.
`.trim()

function jsonError(
  message: string,
  status: number,
  name = "Error"
) {
  return new Response(
    JSON.stringify({
      error: { name, message, status },
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

  if (!user.data || (user.data.credits ?? 0) < 1) {
    return new Response(
      JSON.stringify({
        data: null,
        error: {
          status: 402,
          name: "InsufficientCredits",
          message: "Insufficient credits to generate summary",
        },
      }),
      { status: 402, headers: { "Content-Type": "application/json" } }
    )
  }

  let body: { fullTranscript?: string }
  try {
    body = (await req.json()) as { fullTranscript?: string }
  } catch {
    return jsonError("Invalid JSON body", 400)
  }

  const { fullTranscript } = body
  if (!fullTranscript) {
    return jsonError("No transcript provided", 400)
  }

  try {
    const summary = await services.summarize.generateSummary(
      fullTranscript,
      TEMPLATE
    )
    return new Response(JSON.stringify({ data: summary, error: null }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Error generating summary"
    return jsonError(message, 500)
  }
}
