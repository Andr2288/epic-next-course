import {
  fetchTranscript as fetchTranscriptFromPackage,
  type TranscriptResponse,
  YoutubeTranscriptNotAvailableLanguageError,
} from "youtube-transcript"
import type { TranscriptData, TranscriptSegment } from "./types"

type CaptionList = {
  caption_tracks?: {
    base_url: string
    kind?: string
    language_code: string
  }[]
}

const YT_FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept: "*/*",
  "Accept-Language": "en-US,en;q=0.9",
} as const

function parseTimedtextUrl(base: string): URL {
  try {
    return new URL(base)
  } catch {
    return new URL(base, "https://www.youtube.com")
  }
}

function decodeXmlText(s: string): string {
  return s
    .replaceAll("&amp;", "&")
    .replaceAll("&#38;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&#39;", "'")
    .replaceAll("&quot;", '"')
    .replaceAll(/\s+/g, " ")
    .trim()
}

function extractTextFromTranscriptXml(raw: string): string | null {
  if (!raw.includes("<text") && !raw.includes("<transcript") && !raw.includes("<p ")) {
    return null
  }
  const parts: string[] = []
  const re = /<text[^>]*>([\s\S]*?)<\/text>/gi
  let m: RegExpExecArray | null
  m = re.exec(raw)
  while (m !== null) {
    const inner = m[1].replaceAll(/<[^>]+>/g, " ")
    if (inner.trim()) {
      parts.push(decodeXmlText(inner))
    }
    m = re.exec(raw)
  }
  if (parts.length) {
    return parts.join(" ").replace(/\s+/g, " ").trim()
  }
  // srv3 <p t="..."><s>...</s></p>
  const pRe = /<p\s+t="(\d+)"\s+d="(\d+)"[^>]*>([\s\S]*?)<\/p>/g
  let p: RegExpExecArray | null
  p = pRe.exec(raw)
  while (p !== null) {
    const inner = p[3] ?? ""
    const sRe = /<s[^>]*>([^<]*)<\/s>/g
    let sm: RegExpExecArray | null
    let line = ""
    sm = sRe.exec(inner)
    while (sm !== null) {
      line += sm[1] ?? ""
      sm = sRe.exec(inner)
    }
    if (!line.trim()) {
      line = inner.replaceAll(/<[^>]+>/g, " ")
    }
    if (line.trim()) {
      parts.push(decodeXmlText(line))
    }
    p = pRe.exec(raw)
  }
  const t = parts.join(" ").replace(/\s+/g, " ").trim()
  return t || null
}

function extractTextFromJson3(raw: string): string | null {
  let j: unknown
  try {
    j = JSON.parse(raw)
  } catch {
    return null
  }
  if (j == null || typeof j !== "object" || !("events" in j)) {
    return null
  }
  const events = (j as { events?: unknown[] }).events
  if (!Array.isArray(events)) {
    return null
  }
  const partList: string[] = []
  for (const ev of events) {
    if (ev == null || typeof ev !== "object" || !("segs" in ev)) {
      continue
    }
    const segs = (ev as { segs?: { utf8?: string; aAppend?: string }[] }).segs
    if (!Array.isArray(segs)) {
      continue
    }
    for (const s of segs) {
      if (s.utf8) {
        partList.push(s.utf8)
      }
      if (s.aAppend) {
        partList.push(s.aAppend)
      }
    }
  }
  const t = partList.join(" ").replace(/\s+/g, " ").trim()
  return t || null
}

function extractTextFromVtt(raw: string): string | null {
  const out: string[] = []
  for (const line of raw.split("\n")) {
    const t = line.trim()
    if (
      !t ||
      t.startsWith("WEBVTT") ||
      t === "Kind: captions" ||
      /^\d{1,2}:\d{2}:\d{2}\.\d{3}\s*-->/.test(t) ||
      /^\d+:\d{1,2}:\d{1,2}[\s.]/.test(t) ||
      /^\d+:\d{1,2}\s/.test(t)
    ) {
      continue
    }
    if (t.startsWith("NOTE ")) {
      continue
    }
    out.push(t)
  }
  return out.join(" ").replace(/\s+/g, " ").trim() || null
}

/** Fallback: signed timedtext URL from player (often empty with plain `fetch` — use sparingly). */
async function fetchPlainTextForTimedtextUrl(inputUrl: URL): Promise<string | null> {
  const build = (fmt: string | "omit") => {
    const x = new URL(inputUrl.href)
    if (fmt === "omit") {
      x.searchParams.delete("fmt")
    } else {
      x.searchParams.set("fmt", fmt)
    }
    return x.href
  }
  for (const fmt of ["json3", "srv1", "srv3", "vtt", "omit"] as const) {
    const href = build(fmt)
    const res = await fetch(href, { cache: "no-store", headers: YT_FETCH_HEADERS })
    if (!res.ok) {
      continue
    }
    const raw = (await res.text())?.trim() ?? ""
    if (!raw) {
      continue
    }
    if (raw.startsWith("{") || raw.startsWith("[")) {
      const from3 = extractTextFromJson3(raw)
      if (from3) {
        return from3
      }
    }
    if (raw.startsWith("WEBVTT") || (raw.includes("-->") && /\d{1,2}:\d{2}/.test(raw))) {
      const vtt = extractTextFromVtt(raw)
      if (vtt) {
        return vtt
      }
    }
    const xml = extractTextFromTranscriptXml(raw)
    if (xml) {
      return xml
    }
  }
  return null
}

function orderedCaptionTracks(
  tracks: { base_url: string; kind?: string; language_code: string }[]
) {
  const seen = new Set<string>()
  const out: typeof tracks = []
  const push = (t: (typeof tracks)[0]) => {
    if (t?.base_url && !seen.has(t.base_url)) {
      seen.add(t.base_url)
      out.push(t)
    }
  }
  for (const t of tracks) {
    if (t.kind === "asr") {
      push(t)
    }
  }
  for (const t of tracks) {
    if (t.language_code === "en") {
      push(t)
    }
  }
  for (const t of tracks) {
    push(t)
  }
  return out
}

async function fetchTextFromCaptionTracks(
  info: { captions?: CaptionList | null }
): Promise<string | null> {
  const tracks = info.captions?.caption_tracks
  if (!tracks?.length) {
    return null
  }
  for (const track of orderedCaptionTracks(tracks)) {
    if (!track?.base_url) {
      continue
    }
    const u = parseTimedtextUrl(track.base_url)
    const text = await fetchPlainTextForTimedtextUrl(u)
    if (text) {
      return text
    }
  }
  return null
}

function cleanImageUrl(url: string): string {
  return url.split("?")[0]
}

function validateIdentifier(identifier: string): void {
  if (!identifier || typeof identifier !== "string") {
    throw new Error("Invalid YouTube video identifier")
  }
}

type SegmentNode = { type?: string; snippet?: { text?: string }; start_ms: string; end_ms: string }

function textFromSegment(segment: SegmentNode): string {
  if (!segment?.snippet) {
    return ""
  }
  if (typeof segment.snippet === "string") {
    return segment.snippet
  }
  return String(segment.snippet.text ?? "")
}

const processTranscriptSegments = (segments: SegmentNode[]): TranscriptSegment[] => {
  return segments
    .filter((s) => s && (s.type === "TranscriptSegment" || s.snippet))
    .map((segment) => ({
      text: textFromSegment(segment),
      start: Number(segment.start_ms),
      end: Number(segment.end_ms),
      duration: Number(segment.end_ms) - Number(segment.start_ms),
    }))
}

const DEFAULT_LANG = process.env.TRANSCRIPT_DEFAULT_LANG

/**
 * Best-effort: `youtube-transcript` uses YouTube InnerTube /player (Android) + XML parse — works
 * when signed timedtext URLs return empty bodies to server-side `fetch` (Node/Next).
 */
async function tryPackageTranscript(
  identifier: string
): Promise<{ text: string; segments: TranscriptSegment[] } | null> {
  const preferLang = DEFAULT_LANG?.trim() || "en"
  let rows: TranscriptResponse[]
  try {
    rows = await fetchTranscriptFromPackage(identifier, { lang: preferLang })
  } catch (e) {
    if (e instanceof YoutubeTranscriptNotAvailableLanguageError) {
      try {
        rows = await fetchTranscriptFromPackage(identifier)
      } catch {
        return null
      }
    } else {
      return null
    }
  }
  if (!rows?.length) {
    return null
  }
  const text = rows.map((r) => r.text).join(" ").replace(/\s+/g, " ").trim()
  const segments: TranscriptSegment[] = rows.map((r) => ({
    text: r.text,
    start: r.offset,
    end: r.offset + r.duration,
    duration: r.duration,
  }))
  return { text, segments }
}

export const generateTranscript = async (identifier: string): Promise<TranscriptData> => {
  const { Innertube } = await import("youtubei.js")
  const youtube = await Innertube.create({ lang: "en", location: "US" })

  validateIdentifier(identifier)
  const info = await youtube.getInfo(identifier)
  if (!info) {
    throw new Error("No video information found")
  }

  const bi = info.basic_info
  const videoId = bi.id ?? identifier
  const title = bi.title || "Untitled Video"
  const firstThumb = bi.thumbnail?.[0]
  const rawUrl = firstThumb && "url" in firstThumb ? String(firstThumb.url) : undefined
  const thumbnailUrl = rawUrl ? cleanImageUrl(rawUrl) : undefined

  const fromPackage = await tryPackageTranscript(identifier)
  if (fromPackage && fromPackage.text.length > 0) {
    return {
      title,
      videoId,
      thumbnailUrl,
      fullTranscript: fromPackage.text,
      transcriptWithTimeCodes: fromPackage.segments,
    }
  }

  let fullTranscript: string | undefined
  let transcriptWithTimeCodes: TranscriptSegment[] = []

  try {
    const transcriptData = await info.getTranscript()
    const content = transcriptData.transcript?.content
    const initialSegments = content?.body?.initial_segments
    if (initialSegments?.length) {
      const segments: SegmentNode[] = []
      for (const s of initialSegments) {
        const n = s as unknown as SegmentNode
        if (n?.snippet) {
          segments.push(n)
        }
      }
      if (segments.length > 0) {
        transcriptWithTimeCodes = processTranscriptSegments(segments)
        fullTranscript = segments
          .map((s) => textFromSegment(s))
          .filter(Boolean)
          .join(" ")
      }
    }
  } catch {
    // try captions
  }

  if (!fullTranscript?.trim()) {
    const fromCaptions = await fetchTextFromCaptionTracks(info)
    if (!fromCaptions) {
      throw new Error(
        "No transcript or captions for this video. It may be age-restricted, region-limited, or have no subtitles."
      )
    }
    fullTranscript = fromCaptions
  }

  return {
    title,
    videoId,
    thumbnailUrl,
    fullTranscript: fullTranscript || undefined,
    transcriptWithTimeCodes,
  }
}
