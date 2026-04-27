"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { createSummaryAction } from "@/data/actions/summary"
import { api } from "@/data/data-api"
import { cn, extractYouTubeID } from "@/lib/utils"

import { Input } from "@/components/ui/input"
import { SubmitButton } from "@/components/custom/submit-button"

type ITranscriptResponse = {
  fullTranscript: string
  title?: string
  videoId?: string
  thumbnailUrl?: string
}

interface IErrors {
  message: string | null
  name: string
}

const INITIAL_STATE: IErrors = {
  message: null,
  name: "",
}

export function SummaryForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<IErrors>(INITIAL_STATE)
  const [value, setValue] = useState("")

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const videoId = formData.get("videoId") as string
    const processedVideoId = extractYouTubeID(videoId.trim())

    if (!processedVideoId) {
      toast.error("Invalid YouTube video ID or URL")
      setLoading(false)
      setValue("")
      setError({
        ...INITIAL_STATE,
        message: "Invalid YouTube video ID or URL",
        name: "Invalid Id",
      })
      return
    }

    let currentToastId: string | number | undefined

    try {
      currentToastId = toast.loading("Getting transcript...")

      const transcriptResponse = await api.post<
        ITranscriptResponse,
        { videoId: string }
      >("/api/transcript", { videoId: processedVideoId }, { timeoutMs: 150_000 })

      if (!transcriptResponse.success) {
        if (currentToastId !== undefined) toast.dismiss(currentToastId)
        toast.error(
          transcriptResponse.error?.message ?? "Failed to load transcript"
        )
        return
      }

      const fullTranscript = transcriptResponse.data?.fullTranscript
      if (!fullTranscript) {
        if (currentToastId !== undefined) toast.dismiss(currentToastId)
        toast.error("No transcript data found")
        return
      }

      if (currentToastId !== undefined) toast.dismiss(currentToastId)
      currentToastId = toast.loading("Generating summary...")

      const summaryResponse = await api.post<string, { fullTranscript: string }>(
        "/api/summarize",
        { fullTranscript },
        { timeoutMs: 120_000 }
      )

      if (!summaryResponse.success) {
        if (currentToastId !== undefined) toast.dismiss(currentToastId)
        toast.error(
          summaryResponse.error?.message ?? "Failed to generate summary"
        )
        return
      }

      const summaryText = summaryResponse.data
      if (!summaryText) {
        if (currentToastId !== undefined) toast.dismiss(currentToastId)
        toast.error("No summary generated")
        return
      }

      if (currentToastId !== undefined) toast.dismiss(currentToastId)
      currentToastId = toast.loading("Saving summary...")

      const saveResponse = await createSummaryAction({
        title:
          transcriptResponse.data?.title ?? `Summary for ${processedVideoId}`,
        content: summaryText,
        videoId: processedVideoId,
      })

      if (!saveResponse.success) {
        if (currentToastId !== undefined) toast.dismiss(currentToastId)
        toast.error(
          saveResponse.error?.message ?? "Failed to save summary"
        )
        return
      }

      if (currentToastId !== undefined) {
        toast.dismiss(currentToastId)
        currentToastId = undefined
      }
      toast.success("Summary created and saved!")
      setValue("")
      if (saveResponse.data?.documentId) {
        router.push(`/dashboard/summaries/${saveResponse.data.documentId}`)
      } else {
        router.push("/dashboard/summaries")
      }
    } catch (e) {
      if (currentToastId !== undefined) toast.dismiss(currentToastId)
      console.error(e)
      toast.error(
        e instanceof Error ? e.message : "Failed to create summary"
      )
    } finally {
      setLoading(false)
    }
  }

  function clearError() {
    setError(INITIAL_STATE)
    if (error.message) {
      setValue("")
    }
  }

  const errorStyles = error.message
    ? "outline-1 outline outline-red-500 placeholder:text-red-800 dark:placeholder:text-red-200"
    : ""

  return (
    <div className="min-w-0 w-full max-w-md flex-1">
      <form
        onSubmit={handleFormSubmit}
        className="flex w-full min-w-0 items-center gap-2"
      >
        <Input
          name="videoId"
          placeholder={error.message ?? "YouTube video ID or URL"}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
          }}
          onPointerDown={clearError}
          className={cn(
            "w-full min-w-0 focus-visible:ring-pink-500/60",
            errorStyles
          )}
          required
        />
        <SubmitButton
          text="Create summary"
          loadingText="Working…"
          className="shrink-0 bg-pink-500 text-white hover:bg-pink-600"
          loading={loading}
        />
      </form>
    </div>
  )
}
