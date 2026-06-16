import { Sidebar } from "./sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-muted/20">
        <div className="max-w-7xl mx-auto p-8 h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
