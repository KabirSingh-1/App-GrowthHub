import { AppLayout } from "@/components/layout/app-layout";
import { useGetDashboardStats, useGetRecommendations } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: recommendations, isLoading: recLoading } = useGetRecommendations();

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">Dashboard</h1>
          <p className="text-lg text-muted-foreground mt-2 font-medium">Your app growth command center.</p>
        </div>

        {statsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard title="Total Downloads" value={stats.totalDownloads.toLocaleString()} />
            <StatsCard title="Avg Rating" value={stats.avgRating.toFixed(1)} subtitle={`${stats.totalReviews} reviews`} />
            <StatsCard title="Active Campaigns" value={stats.activeCampaigns} />
            <StatsCard title="Total Spend" value={`$${stats.totalSpend.toLocaleString()}`} />
          </div>
        ) : null}

        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Recommended for You</h2>
          {recLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-48 rounded-2xl" />
              ))}
            </div>
          ) : recommendations && recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map(rec => (
                <Card key={rec.id} className="rounded-2xl border-border/50 shadow-sm hover-elevate transition-all cursor-pointer bg-card overflow-hidden">
                  <div className={`h-2 w-full ${getPriorityColor(rec.priority)}`} />
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">{rec.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground font-medium mb-4">{rec.description}</p>
                    <div className="font-bold text-primary">{rec.ctaLabel} &rarr;</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-muted/30 rounded-2xl border border-dashed border-border">
              <p className="text-muted-foreground font-medium">No recommendations right now. Keep growing!</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

function StatsCard({ title, value, subtitle }: { title: string, value: string | number, subtitle?: string }) {
  return (
    <Card className="rounded-2xl border-border/50 shadow-sm bg-card hover-elevate transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-black text-foreground">{value}</div>
        {subtitle && <p className="text-sm text-muted-foreground mt-1 font-medium">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high': return 'bg-primary';
    case 'medium': return 'bg-secondary';
    case 'low': return 'bg-accent';
    default: return 'bg-muted';
  }
}
