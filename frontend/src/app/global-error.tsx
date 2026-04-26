"use client"

import Link from "next/link"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"

import { FallbackHeader } from "@/components/custom/fallback-header"

const styles = {
  container:
    "flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4",
  content: "mx-auto max-w-2xl space-y-8 text-center",
  textSection: "space-y-4",
  headingError: "select-none text-8xl font-bold text-red-600",
  headingContainer: "relative",
  pageTitle: "mb-4 text-4xl font-bold text-gray-900",
  description:
    "mx-auto max-w-md text-lg leading-relaxed text-gray-600",
  illustrationContainer: "flex justify-center py-8",
  illustration: "relative animate-pulse",
  errorCircle:
    "flex h-32 w-32 items-center justify-center rounded-full bg-red-100 transition-all duration-300 hover:bg-red-200",
  errorIcon: "h-16 w-16 text-red-500",
  warningBadge:
    "absolute -top-2 -right-2 flex h-8 w-8 animate-bounce items-center justify-center rounded-full bg-orange-100",
  warningSymbol: "text-xl font-bold text-orange-500",
  buttonContainer:
    "flex flex-col items-center justify-center gap-4 sm:flex-row",
  button:
    "min-w-[160px] rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700",
  buttonContent: "flex items-center justify-center gap-2",
  buttonIcon: "h-4 w-4",
  outlineButton:
    "inline-flex min-w-[160px] items-center justify-center gap-2 rounded-lg border-2 border-red-600 px-6 py-3 font-medium text-red-600 transition-colors hover:bg-red-50",
  errorDetails:
    "mt-8 rounded-lg border border-red-200 bg-red-50 p-4 text-left text-sm text-red-800",
  errorTitle: "mb-2 font-semibold",
}

interface IGlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: IGlobalErrorProps) {
  return (
    <html lang="en">
      <body>
        <FallbackHeader
          header={{
            logoText: {
              id: 1,
              href: "/",
              label: "Summarize AI",
              isExternal: false,
            },
            ctaButton: {
              id: 2,
              href: "/",
              label: "Get Help",
              isExternal: false,
            },
          }}
        />
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.textSection}>
              <h1 className={styles.headingError}>Global Error</h1>
              <div className={styles.headingContainer}>
                <h2 className={styles.pageTitle}>Application Error</h2>
                <p className={styles.description}>
                  A critical error occurred that prevented the application from
                  loading properly. Please try refreshing the page.
                </p>
              </div>
            </div>

            <div className={styles.illustrationContainer}>
              <div className={styles.illustration}>
                <div className={styles.errorCircle}>
                  <AlertTriangle className={styles.errorIcon} />
                </div>
                <div className={styles.warningBadge}>
                  <span className={styles.warningSymbol}>!</span>
                </div>
              </div>
            </div>

            <div className={styles.buttonContainer}>
              <button
                className={styles.button}
                type="button"
                onClick={() => reset()}
              >
                <span className={styles.buttonContent}>
                  <RefreshCw className={styles.buttonIcon} />
                  Try Again
                </span>
              </button>

              <Link className={styles.outlineButton} href="/">
                <Home className={styles.buttonIcon} />
                Go Home
              </Link>
            </div>

            {process.env.NODE_ENV === "development" && (
              <div className={styles.errorDetails}>
                <div className={styles.errorTitle}>
                  Error Details (Development Only):
                </div>
                <div>Message: {error.message}</div>
                {error.digest ? <div>Digest: {error.digest}</div> : null}
                {error.stack ? (
                  <details className="mt-2">
                    <summary className="cursor-pointer font-medium">
                      Stack Trace
                    </summary>
                    <pre className="mt-2 max-h-48 overflow-auto text-xs">
                      {error.stack}
                    </pre>
                  </details>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}
