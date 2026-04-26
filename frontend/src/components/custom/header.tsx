import Link from "next/link"
import type { THeader } from "@/types"

import { LoggedInUser } from "@/components/custom/logged-in-user"
import { Logo } from "@/components/custom/logo"
import { Button } from "@/components/ui/button"
import { services } from "@/data/services"

const styles = {
  header:
    "flex items-center justify-between bg-white px-4 py-3 shadow-md dark:bg-gray-800",
  actions: "flex items-center gap-4",
}

interface IHeaderProps {
  data?: THeader | null
}

export async function Header({ data }: IHeaderProps) {
  if (!data) return null

  const user = await services.auth.getUserMeService()
  const { logoText, ctaButton } = data
  return (
    <div className={styles.header}>
      <Logo href={logoText.href} text={logoText.label} />
      <div className={styles.actions}>
        {user.success && user.data ? (
          <LoggedInUser
            userData={{ username: user.data.username, email: user.data.email }}
          />
        ) : (
          <Link href={ctaButton.href}>
            <Button>{ctaButton.label}</Button>
          </Link>
        )}
      </div>
    </div>
  )
}
