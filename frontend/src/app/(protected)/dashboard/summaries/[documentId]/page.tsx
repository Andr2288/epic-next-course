import Markdown from "react-markdown"
import { notFound } from "next/navigation"

import { YouTubePlayer } from "@/components/custom/youtube-player"
import { loaders } from "@/data/loaders"
import { validateApiResponse } from "@/lib/error-handler"
import { extractYouTubeID } from "@/lib/utils"
import type { Params } from "@/types"

export default async function SummarySingleRoute({
  params,
}: {
  readonly params: Params
}) {
  const resolvedParams = await params
  const documentId = resolvedParams?.documentId
  if (!documentId) {
    notFound()
  }

  const data = await loaders.getSummaryByDocumentId(documentId)
  const summary = validateApiResponse(data, "summary")
  const videoId = extractYouTubeID(summary.videoId ?? "")

  return (
    <div className="grid min-h-0 grid-cols-1 gap-4 overflow-hidden p-4 md:min-h-[calc(100dvh-60px)] md:grid-cols-5 md:gap-6">
      <div className="prose prose-sm col-span-1 min-h-0 max-w-none overflow-y-auto pr-0 dark:prose-invert md:col-span-3 md:pr-1">
        <article>
          <Markdown>{summary.content}</Markdown>
        </article>
      </div>
      <div className="min-h-0 col-span-1 space-y-4 overflow-y-auto md:col-span-2">
        {videoId ? (
          <YouTubePlayer videoId={videoId} />
        ) : (
          <p className="text-sm text-muted-foreground">Invalid or missing video URL</p>
        )}
        <h1 className="text-2xl font-bold text-foreground">
          {summary.title || "Video summary"}
        </h1>
      </div>
    </div>
  )
}
