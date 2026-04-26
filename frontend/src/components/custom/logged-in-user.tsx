import Link from "next/link";

import { LogoutButton } from "@/components/custom/logout-button";

export interface ILoggedInUserProps {
  username: string;
  email: string;
}

const styles = {
  wrap: "flex items-center gap-4",
  link: "font-semibold hover:text-primary",
};

export function LoggedInUser({
  userData,
}: {
  readonly userData: ILoggedInUserProps;
}) {
  return (
    <div className={styles.wrap}>
      <Link className={styles.link} href="/dashboard/account">
        {userData.username}
      </Link>
      <LogoutButton />
    </div>
  );
}
