import { LogoutButton } from "@/components/custom/logout-button";

export default function DashboardRoute() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <LogoutButton />
    </div>
  );
}
