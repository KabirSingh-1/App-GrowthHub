import { AppLayout } from "@/components/layout/app-layout";
import { useListApps } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AppsList() {
  const { data: apps, isLoading } = useListApps();

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">Your Apps</h1>
            <p className="text-lg text-muted-foreground mt-2 font-medium">Manage all your connected properties.</p>
          </div>
          <Button className="rounded-xl font-bold shadow-sm hover-elevate">
            <Plus className="mr-2 h-5 w-5" /> Add App
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : apps && apps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map(app => (
              <Link key={app.id} href={`/apps/${app.id}`}>
                <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm hover-elevate cursor-pointer transition-all group">
                  <div className="flex items-start gap-4 mb-6">
                    {app.iconUrl ? (
                      <img src={app.iconUrl} alt={app.name} className="w-16 h-16 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-xl font-bold text-muted-foreground group-hover:scale-105 transition-transform">
                        {app.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-xl line-clamp-1">{app.name}</h3>
                      <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{app.platform}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-xl p-3">
                      <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Downloads</div>
                      <div className="font-black text-lg">{app.totalDownloads.toLocaleString()}</div>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-3">
                      <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Rating</div>
                      <div className="font-black text-lg">{app.rating.toFixed(1)}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-card rounded-2xl border border-dashed border-border">
            <h3 className="text-xl font-bold mb-2">No apps connected</h3>
            <p className="text-muted-foreground font-medium mb-6">Connect your first app to start growing.</p>
            <Button className="rounded-xl font-bold shadow-sm hover-elevate">
              <Plus className="mr-2 h-5 w-5" /> Connect App
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
