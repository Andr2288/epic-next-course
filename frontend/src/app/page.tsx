import qs from "qs";
import { HeroSection, type IHeroSectionProps } from "@/components/custom/hero-section";

export const dynamic = "force-dynamic";

const homePageQuery = qs.stringify({
  populate: {
    blocks: {
      on: {
        "layout.hero-section": {
          populate: {
            image: {
              fields: ["url", "alternativeText"],
            },
            link: {
              populate: true,
            },
          },
        },
      },
    },
  },
});

async function getStrapiData(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
  const url = new URL(path, baseUrl);
  url.search = homePageQuery;

  try {
    const response = await fetch(url.href, { cache: "no-store" });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export default async function Home() {
  const strapiData = await getStrapiData("/api/home-page");
  const raw = strapiData?.data;
  const page = raw?.attributes ?? raw;
  const blocks = page?.blocks as
    | Array<{ __component?: string } & Record<string, unknown>>
    | undefined;

  const heroData = blocks?.find((b) => b.__component === "layout.hero-section") as
    | IHeroSectionProps
    | undefined;

  return (
    <main>
      <HeroSection data={heroData} />
    </main>
  );
}
