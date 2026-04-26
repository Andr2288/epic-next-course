import { LogOut } from "lucide-react";

import { actions } from "@/data/actions";

export function LogoutButton() {
  return (
    <form action={actions.auth.logoutUserAction}>
      <button type="submit" aria-label="Log out">
        <LogOut className="h-6 w-6 hover:text-primary" />
      </button>
    </form>
  );
}
