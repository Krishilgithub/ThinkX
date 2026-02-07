import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { getCurrentUser } from "@/actions/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar - Hidden on mobile, handled by mobile menu component inside Header or dedicated mobile nav */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
        <Sidebar user={user} />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background/50">
          {children}
        </main>
      </div>
    </div>
  );
}
