import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStrapiURL() {
  return process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337"
}

/** Accepts a raw 11-char YouTube id or a watch/shorts URL. */
export function extractYouTubeID(urlOrId: string): string | null {
  const regExpId = /^[a-zA-Z0-9_-]{11}$/
  if (regExpId.test(urlOrId)) {
    return urlOrId
  }
  const matchStandard = urlOrId.match(
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/
  )
  if (matchStandard) {
    return matchStandard[1] ?? null
  }
  const matchShorts = urlOrId.match(
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/
  )
  if (matchShorts) {
    return matchShorts[1] ?? null
  }
  return null
}
