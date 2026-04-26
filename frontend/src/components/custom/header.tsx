import Link from "next/link"
import type { THeader } from "@/types"

import { Logo } from "@/components/custom/logo"
import { Button } from "@/components/ui/button"

const styles = {
  header:
    "flex items-center justify-between bg-white px-4 py-3 shadow-md dark:bg-gray-800",
  actions: "flex items-center gap-4",
}

interface IHeaderProps {
  data?: THeader | null
}

export function Header({ data }: IHeaderProps) {
  if (!data) return null

  const { logoText, ctaButton } = data
  return (
    <div className={styles.header}>
      <Logo href={logoText.href} text={logoText.label} />
      <div className={styles.actions}>
        <Link href={ctaButton.href}>
          <Button>{ctaButton.label}</Button>
        </Link>
      </div>
    </div>
  )
}
