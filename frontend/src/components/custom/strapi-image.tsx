import Image from "next/image"

import { getStrapiURL } from "@/lib/utils"

interface IStrapiMediaProps {
  src: string
  alt: string | null
  height?: number
  width?: number
  className?: string
  fill?: boolean
  priority?: boolean
  /** LCP: use `eager` with `priority` for above-the-fold avatars. */
  loading?: "eager" | "lazy"
}

export function getStrapiMedia(url: string | null) {
  const strapiURL = getStrapiURL()
  if (url == null) return null
  if (url.startsWith("data:")) return url
  if (url.startsWith("http") || url.startsWith("//")) return url
  return `${strapiURL}${url}`
}

function isLocalStrapiUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return u.hostname === "localhost" || u.hostname === "127.0.0.1"
  } catch {
    return false
  }
}

export function StrapiImage({
  src,
  alt,
  className,
  loading,
  priority,
  ...rest
}: Readonly<IStrapiMediaProps>) {
  const imageUrl = getStrapiMedia(src)
  if (!imageUrl) return null
  const unoptimized =
    imageUrl.startsWith("data:") || isLocalStrapiUrl(imageUrl)
  return (
    <Image
      {...rest}
      alt={alt ?? "No alternative text provided"}
      className={className}
      fetchPriority={priority ? "high" : undefined}
      loading={loading}
      priority={priority}
      src={imageUrl}
      unoptimized={unoptimized}
    />
  )
}
