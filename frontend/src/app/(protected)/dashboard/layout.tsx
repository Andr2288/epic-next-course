import type { SVGProps } from "react";
import Link from "next/link";

const styles = {
  layout: "grid h-screen grid-cols-1 md:grid-cols-[240px_1fr]",
  sidebar: "border-b bg-gray-100/40 md:border-b-0 md:border-r dark:bg-gray-800/40",
  sidebarContent: "flex max-h-screen flex-col gap-2",
  header: "flex h-[60px] items-center border-b px-6",
  headerLink: "flex items-center gap-2 font-semibold",
  headerIcon: "h-6 w-6",
  navigation: "flex-1 overflow-auto py-2",
  navGrid: "grid items-start px-4 text-sm font-medium",
  navLink:
    "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
  navIcon: "h-4 w-4",
  main: "flex flex-col overflow-y-auto",
};

export default function DashboardLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className={styles.layout}>
      <nav className={styles.sidebar}>
        <div className={styles.sidebarContent}>
          <div className={styles.header}>
            <Link className={styles.headerLink} href="/dashboard">
              <LayoutDashboardIcon className={styles.headerIcon} />
              <span>Dashboard</span>
            </Link>
          </div>
          <div className={styles.navigation}>
            <nav className={styles.navGrid}>
              <Link className={styles.navLink} href="/dashboard/summaries">
                <ViewIcon className={styles.navIcon} />
                Summaries
              </Link>
              <Link className={styles.navLink} href="/dashboard/account">
                <UsersIcon className={styles.navIcon} />
                Account
              </Link>
            </nav>
          </div>
        </div>
      </nav>
      <main className={styles.main}>{children}</main>
    </div>
  );
}

function LayoutDashboardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <title>Dashboard</title>
      <rect height="9" rx="1" width="7" x="3" y="3" />
      <rect height="5" rx="1" width="7" x="14" y="3" />
      <rect height="9" rx="1" width="7" x="14" y="12" />
      <rect height="5" rx="1" width="7" x="3" y="16" />
    </svg>
  );
}

function UsersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <title>Account</title>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ViewIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <title>Summaries</title>
      <path d="M5 12s2.545-5 7-5c4.454 0 7 5 7 5s-2.546 5-7 5c-4.455 0-7-5-7-5z" />
      <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
      <path d="M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2" />
      <path d="M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" />
    </svg>
  );
}
