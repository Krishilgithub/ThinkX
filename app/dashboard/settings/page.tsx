export const dynamic = "force-dynamic";
import { getDemoUser } from "@/actions/user";
import { SettingsForm } from "@/components/dashboard/SettingsForm";

export default async function SettingsPage() {
  const user = await getDemoUser();

  if (!user) {
    return <div>User not found. Please seed the database.</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      <SettingsForm user={user} />
    </div>
  );
}
