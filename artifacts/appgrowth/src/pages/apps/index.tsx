import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus, Star, Trash2, ExternalLink } from "lucide-react";
import { getApps, removeApp, type StoredApp } from "@/lib/app-store";
import { AddAppModal } from "@/components/add-app-modal";

function AppStoreIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="5.5" fill="#1C8EF9" />
      <path d="M12 4.5L13.545 7.636H16.8L14.13 9.546L15.18 12.75L12 10.909L8.82 12.75L9.87 9.546L7.2 7.636H10.455L12 4.5Z" fill="white" />
      <path d="M8.5 14.5H15.5M10.5 17H13.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function AppsList() {
  const [apps, setApps] = useState<StoredApp[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Read from localStorage on mount
    setApps(getApps());
    setIsLoading(false);
  }, []);

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = removeApp(id);
    setApps(updated);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">Your Apps</h1>
            <p className="text-lg text-muted-foreground mt-2 font-medium">Manage all your connected properties.</p>
          </div>
          <AddAppModal onAppAdded={() => setApps(getApps())}>
            <Button className="rounded-xl font-bold shadow-sm hover-elevate">
              <Plus className="mr-2 h-5 w-5" /> Add App
            </Button>
          </AddAppModal>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : apps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map(app => (
              <div
                key={app.id}
                className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md cursor-pointer transition-all group relative"
              >
                {/* Remove button */}
                <button
                  onClick={(e) => handleRemove(app.id, e)}
                  className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove app"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-start gap-4 mb-6">
                  {/* App Icon */}
                  {app.iconUrl ? (
                    <img
                      src={app.iconUrl}
                      alt={app.name}
                      className="w-16 h-16 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary group-hover:scale-105 transition-transform">
                      {app.name.charAt(0)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xl line-clamp-1">{app.name}</h3>
                    <p className="text-sm text-muted-foreground font-medium truncate">{app.developer}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <AppStoreIcon size={14} />
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{app.platform}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Rating */}
                  <div className="bg-muted/50 rounded-xl p-3">
                    <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Rating</div>
                    <div className="font-black text-lg flex items-center gap-1">
                      {app.rating !== null ? (
                        <>
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          {app.rating.toFixed(1)}
                        </>
                      ) : (
                        <span className="text-muted-foreground text-sm font-medium">—</span>
                      )}
                    </div>
                  </div>

                  {/* Store Link */}
                  <div className="bg-muted/50 rounded-xl p-3">
                    <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Store</div>
                    <a
                      href={app.storeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="font-bold text-sm text-primary flex items-center gap-1 hover:underline"
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Added date */}
                <p className="text-xs text-muted-foreground mt-4">
                  Added {new Date(app.addedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center bg-card rounded-2xl border border-dashed border-border">
            <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No apps added yet</h3>
            <p className="text-muted-foreground font-medium mb-6">
              Search for an app on the home page and select it to add it here.
            </p>
            <AddAppModal onAppAdded={() => setApps(getApps())}>
              <Button className="rounded-xl font-bold shadow-sm hover-elevate">
                <Plus className="mr-2 h-5 w-5" /> Search & Add App
              </Button>
            </AddAppModal>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
