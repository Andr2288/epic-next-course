"use client"

import Link from "next/link"
import { ArrowLeft, Home, Search } from "lucide-react"

import { Button } from "@/components/ui/button"

const styles = {
  container:
    "container mx-auto my-8 flex min-h-[calc(100vh-200px)] items-center justify-center rounded-lg bg-gradient-to-br from-secondary to-secondary/80 p-4 shadow-md",
  content: "mx-auto max-w-2xl space-y-8 text-center",
  textSection: "space-y-4",
  heading404: "select-none text-9xl font-bold text-primary",
  headingContainer: "relative",
  pageTitle: "mb-4 text-4xl font-bold text-slate-800",
  description:
    "mx-auto max-w-md text-lg leading-relaxed text-slate-600",
  illustrationContainer: "flex justify-center py-8",
  illustration: "relative animate-pulse",
  searchCircle:
    "flex h-32 w-32 items-center justify-center rounded-full bg-slate-200 transition-all duration-300 hover:bg-slate-300",
  searchIcon: "h-16 w-16 text-slate-400",
  errorBadge:
    "absolute -top-2 -right-2 flex h-8 w-8 animate-bounce items-center justify-center rounded-full bg-red-100",
  errorSymbol: "text-xl font-bold text-red-500",
  buttonContainer:
    "flex flex-col items-center justify-center gap-4 sm:flex-row",
  button: "min-w-[160px]",
  buttonContent: "flex items-center gap-2",
  buttonIcon: "h-4 w-4",
  outlineButton: "min-w-[160px] bg-transparent",
}

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.textSection}>
          <h1 className={styles.heading404}>404</h1>
          <div className={styles.headingContainer}>
            <h2 className={styles.pageTitle}>Page Not Found</h2>
            <p className={styles.description}>
              Oops! The page you&apos;re looking for seems to have wandered off
              into the digital wilderness.
            </p>
          </div>
        </div>

        <div className={styles.illustrationContainer}>
          <div className={styles.illustration}>
            <div className={styles.searchCircle}>
              <Search className={styles.searchIcon} />
            </div>
            <div className={styles.errorBadge}>
              <span className={styles.errorSymbol}>✕</span>
            </div>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <Button asChild className={styles.button} size="lg">
            <Link className={styles.buttonContent} href="/">
              <Home className={styles.buttonIcon} />
              Go Home
            </Link>
          </Button>

          <Button
            className={styles.outlineButton}
            size="lg"
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            <span className={styles.buttonContent}>
              <ArrowLeft className={styles.buttonIcon} />
              Go Back
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}
