import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

import { Footer } from "@/components/custom/footer"
import { Header } from "@/components/custom/header"
import { loaders } from "@/data/loaders"
import { validateApiResponse } from "@/lib/error-handler"

export const dynamic = "force-dynamic"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export async function generateMetadata(): Promise<Metadata> {
  const res = await loaders.getMetaData()
  return {
    title: res.success && res.data?.title ? res.data.title : "Epic Next Course",
    description:
      res.success && res.data?.description
        ? res.data.description
        : "Epic Next Course",
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const globalDataResponse = await loaders.getGlobalData()
  const globalData = validateApiResponse(globalDataResponse, "global page")

  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      lang="en"
    >
      <body className="flex min-h-full flex-col">
        <Header data={globalData.header} />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer data={globalData.footer} />
      </body>
    </html>
  )
}
