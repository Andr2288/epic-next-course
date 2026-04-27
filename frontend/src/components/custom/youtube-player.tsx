"use client"

import { useState } from "react"
import { Play } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"

interface IYouTubePlayerProps {
  videoId: string
}

const styles = {
  container: "relative h-[min(50vh,315px)] w-full max-w-2xl overflow-hidden rounded-lg",
  skeletonWrapper: "absolute inset-0 w-full h-full",
  skeleton: "h-full w-full animate-pulse",
  iconContainer: "absolute inset-0 flex items-center justify-center",
  playIcon: "h-16 w-16 animate-bounce text-gray-400",
  iframe: "h-full w-full min-h-[200px] rounded-lg",
}

export function YouTubePlayer({ videoId }: IYouTubePlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className={styles.container}>
      {!isLoaded ? (
        <div className={styles.skeletonWrapper}>
          <Skeleton className={styles.skeleton} />
          <div className={styles.iconContainer}>
            <Play className={styles.playIcon} fill="currentColor" aria-hidden />
          </div>
        </div>
      ) : null}
      <iframe
        className={styles.iframe}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{ display: isLoaded ? "block" : "none" }}
        onLoad={() => {
          setIsLoaded(true)
        }}
        title="YouTube video player"
        width="100%"
        height="315"
        src={`https://www.youtube.com/embed/${videoId}`}
      />
    </div>
  )
}
