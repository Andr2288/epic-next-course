import { SummariesGrid } from "@/components/custom/summaries-grid"
import { loaders } from "@/data/loaders"
import { validateApiResponse } from "@/lib/error-handler"

export default async function SummariesRoute() {
  const data = await loaders.getSummaries()
  const summaries = validateApiResponse(data, "summaries")

  return (
    <div className="flex min-h-0 flex-col gap-4 p-4 sm:p-6">
      <h1 className="text-2xl font-semibold">Summaries</h1>
      <SummariesGrid className="flex-1" summaries={summaries} />
    </div>
  )
}
