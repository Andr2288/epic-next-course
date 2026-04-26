import Link from "next/link"
import type { TImage, TLink } from "@/types"

import { StrapiImage } from "@/components/custom/strapi-image"

export interface IHeroSectionProps {
  id: number
  documentId?: string
  __component: string
  heading: string
  subHeading: string
  image: TImage | null
  link: TLink
}

const styles = {
  header: "relative h-[600px] overflow-hidden",
  overlay:
    "relative z-10 flex h-full flex-col items-center justify-center bg-black/50 text-center text-white",
  heading: "text-4xl font-bold md:text-5xl lg:text-6xl",
  subheading: "mt-4 text-lg md:text-xl lg:text-2xl",
  button:
    "mt-8 inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-medium text-black shadow transition-colors hover:bg-gray-100",
}

const FALLBACK_IMAGE =
  "https://images.pexels.com/photos/7552374/pexels-photo-7552374.jpeg"

export function HeroSection({
  data,
}: {
  readonly data: IHeroSectionProps | undefined
}) {
  if (!data?.link) return null

  const { heading, subHeading, link, image } = data
  const isExternal = Boolean(link.isExternal)

  return (
    <header className={styles.header}>
      <StrapiImage
        alt={image?.alternativeText ?? "no alternative text"}
        className="absolute inset-0 h-full w-full object-cover"
        height={1080}
        src={image?.url ?? FALLBACK_IMAGE}
        width={1920}
      />
      <div className={styles.overlay}>
        <h1 className={styles.heading}>{heading}</h1>
        <p className={styles.subheading}>{subHeading}</p>
        {isExternal ? (
          <a
            className={styles.button}
            href={link.href}
            rel="noopener noreferrer"
            target="_blank"
          >
            {link.label}
          </a>
        ) : (
          <Link className={styles.button} href={link.href}>
            {link.label}
          </Link>
        )}
      </div>
    </header>
  )
}
