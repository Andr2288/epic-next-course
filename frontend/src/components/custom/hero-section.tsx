import Link from "next/link";
import type { TImage, TLink } from "@/types";

export interface IHeroSectionProps {
  id: number;
  documentId?: string;
  __component: string;
  heading: string;
  subHeading: string;
  image: TImage | null;
  link: TLink;
}

const styles = {
  header: "relative h-[600px] overflow-hidden",
  backgroundImage: "absolute inset-0 object-cover w-full h-full",
  overlay:
    "relative z-10 flex flex-col items-center justify-center h-full text-center text-white bg-black/50",
  heading: "text-4xl font-bold md:text-5xl lg:text-6xl",
  subheading: "mt-4 text-lg md:text-xl lg:text-2xl",
  button:
    "mt-8 inline-flex items-center justify-center px-6 py-3 text-base font-medium text-black bg-white rounded-md shadow hover:bg-gray-100 transition-colors",
};

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
const FALLBACK_IMAGE =
  "https://images.pexels.com/photos/7552374/pexels-photo-7552374.jpeg";

export function HeroSection({ data }: { readonly data: IHeroSectionProps | undefined }) {
  if (!data?.link) return null;

  const { heading, subHeading, link, image } = data;
  const imgSrc = image?.url ? `${STRAPI_URL}${image.url}` : FALLBACK_IMAGE;
  const imgAlt = image?.alternativeText ?? "Background";

  const ctaClasses = styles.button;
  const isExternal = Boolean(link.isExternal);

  return (
    <header className={styles.header}>
      <img
        alt={imgAlt}
        className={styles.backgroundImage}
        height={1080}
        src={imgSrc}
        style={{
          aspectRatio: "1920/1080",
          objectFit: "cover",
        }}
        width={1920}
      />
      <div className={styles.overlay}>
        <h1 className={styles.heading}>{heading}</h1>
        <p className={styles.subheading}>{subHeading}</p>
        {isExternal ? (
          <a
            className={ctaClasses}
            href={link.href}
            rel="noopener noreferrer"
            target="_blank"
          >
            {link.label}
          </a>
        ) : (
          <Link className={ctaClasses} href={link.href}>
            {link.label}
          </Link>
        )}
      </div>
    </header>
  );
}
