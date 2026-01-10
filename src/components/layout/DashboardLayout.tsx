import { ReactNode } from "react";
import { GlobalHeader } from "./GlobalHeader";
import { NavigationSidebar } from "./NavigationSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GlobalHeader />
      <div className="flex flex-1 overflow-hidden">
        <NavigationSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
