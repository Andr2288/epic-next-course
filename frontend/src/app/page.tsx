import { FeaturesSection, type IFeaturesSectionProps } from "@/components/custom/features-section"
import {
  HeroSection,
  type IHeroSectionProps,
} from "@/components/custom/hero-section"
import { loaders } from "@/data/loaders"
import { validateApiResponse } from "@/lib/error-handler"

export const dynamic = "force-dynamic"

export type TBlocks = IHeroSectionProps | IFeaturesSectionProps

function blockRenderer(block: TBlocks, index: number) {
  switch (block.__component) {
    case "layout.hero-section":
      return (
        <HeroSection
          key={block.id ?? index}
          data={block as IHeroSectionProps}
        />
      )
    case "layout.features-section":
      return (
        <FeaturesSection
          key={block.id ?? index}
          data={block as IFeaturesSectionProps}
        />
      )
    default:
      return null
  }
}

export default async function Home() {
  const homePageData = await loaders.getHomePageData()
  const data = validateApiResponse(homePageData, "home page")
  const { blocks } = data

  return (
    <main>
      {blocks.map((block, index) =>
        blockRenderer(block as unknown as TBlocks, index)
      )}
    </main>
  )
}
