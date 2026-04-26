export const dynamic = "force-dynamic";

async function getStrapiData(url: string) {
  const baseUrl = "http://localhost:1337";
  try {
    const response = await fetch(baseUrl + url, { cache: "no-store" });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export default async function Home() {
  const strapiData = await getStrapiData("/api/home-page");
  const raw = strapiData?.data;
  const attrs = raw?.attributes;
  const title = raw?.title ?? attrs?.title ?? "Немає даних з Strapi";
  const description =
    raw?.description ?? attrs?.description ?? "Запусти backend (npm run develop), опублікуй Home Page і перевір права Public → find.";

  return (
    <main className="container mx-auto py-6">
      <h1 className="text-5xl font-bold">{title}</h1>
      <p className="text-xl mt-4">{description}</p>
    </main>
  );
}
