export interface TranscriptSegment {
  text: string
  start: number
  end: number
  duration: number
}

export interface TranscriptData {
  title: string | undefined
  videoId: string | undefined
  thumbnailUrl: string | undefined
  fullTranscript: string | undefined
  transcriptWithTimeCodes: TranscriptSegment[]
}
