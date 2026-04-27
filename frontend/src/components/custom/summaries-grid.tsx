import Link from "next/link"
import Markdown from "react-markdown"

import type { TSummary } from "@/types"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const styles = {
  card: "relative cursor-pointer border border-border transition-shadow duration-200 hover:shadow-md",
  cardHeader: "pb-3",
  cardTitle: "line-clamp-2 text-base font-semibold leading-tight text-pink-600",
  cardContent: "pt-0",
  markdown: `prose prose-sm max-w-none overflow-hidden
    prose-p:text-sm prose-p:mb-1 prose-p:mt-0 prose-p:text-muted-foreground
    prose-headings:mb-1 prose-headings:mt-0
    [&>*:nth-child(n+4)]:hidden`,
  grid: "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3",
}

function LinkCard({ summary }: { readonly summary: TSummary }) {
  const { documentId, title, content } = summary
  const preview = (content ?? "").slice(0, 200)

  return (
    <Link href={`/dashboard/summaries/${documentId}`} className="min-w-0 block">
      <Card className={styles.card}>
        <CardHeader className={styles.cardHeader}>
          <CardTitle className={styles.cardTitle}>
            {title || "Video summary"}
          </CardTitle>
        </CardHeader>
        <CardContent className={styles.cardContent}>
          <div className={styles.markdown}>
            {preview ? <Markdown>{preview}</Markdown> : null}
          </div>
          <p className="mt-3 text-xs font-medium text-pink-500">Read more →</p>
        </CardContent>
      </Card>
    </Link>
  )
}

export function SummariesGrid({
  summaries,
  className,
}: {
  readonly summaries: TSummary[]
  readonly className?: string
}) {
  if (summaries.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No summaries yet. Use the form in the header to create one.
      </p>
    )
  }
  return (
    <div className={cn(styles.grid, className)}>
      {summaries.map((item) => (
        <LinkCard key={item.documentId} summary={item} />
      ))}
    </div>
  )
}
