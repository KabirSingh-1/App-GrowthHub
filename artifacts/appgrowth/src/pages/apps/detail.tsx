import { AppLayout } from "@/components/layout/app-layout";
import { useGetApp, useListReviews, useListAsoKeywords } from "@/lib/mock-api";
import { useParams } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Download, Users, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AppDetail() {
  const params = useParams();
  const appId = parseInt(params.id || "0", 10);
  
  const { data: app, isLoading: appLoading } = useGetApp(appId, { query: { enabled: !!appId } });
  const { data: reviews, isLoading: reviewsLoading } = useListReviews(appId, { query: { enabled: !!appId } });
  const { data: asoKeywords, isLoading: asoLoading } = useListAsoKeywords({ appId }, { query: { enabled: !!appId } });

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <Link href="/apps">
            <Button variant="ghost" className="mb-4 text-muted-foreground hover:text-foreground p-0 h-auto font-medium">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Apps
            </Button>
          </Link>
          
          {appLoading ? (
            <div className="flex items-center gap-6">
              <Skeleton className="w-24 h-24 rounded-3xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-10 w-1/3 rounded-xl" />
                <Skeleton className="h-6 w-1/4 rounded-lg" />
              </div>
            </div>
          ) : app ? (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                {app.iconUrl ? (
                  <img src={app.iconUrl} alt={app.name} className="w-24 h-24 rounded-3xl object-cover shadow-md" />
                ) : (
                  <div className="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center text-4xl font-black text-primary-foreground shadow-md">
                    {app.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h1 className="text-4xl font-black tracking-tight text-foreground">{app.name}</h1>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="outline" className="rounded-lg uppercase tracking-wider font-bold text-xs">{app.platform}</Badge>
                    <span className="text-muted-foreground font-medium text-sm">{app.category}</span>
                    {app.bundleId && <span className="text-muted-foreground text-sm font-mono">{app.bundleId}</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="rounded-xl font-bold shadow-sm hover-elevate">Edit App</Button>
                <Button className="rounded-xl font-bold shadow-sm hover-elevate bg-secondary text-secondary-foreground hover:bg-secondary/90">Run Campaign</Button>
              </div>
            </div>
          ) : null}
        </div>

        {app && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard icon={Download} title="Downloads" value={app.totalDownloads.toLocaleString()} />
            <StatsCard icon={Star} title="Rating" value={app.rating.toFixed(1)} subtitle={`${app.reviewCount} reviews`} />
            <StatsCard icon={Users} title="Active Users" value={app.monthlyActiveUsers ? app.monthlyActiveUsers.toLocaleString() : "N/A"} />
            <StatsCard icon={TrendingUp} title="Growth" value="+12%" subtitle="This month" color="text-emerald-500" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="rounded-2xl border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold">Recent Reviews</CardTitle>
              <Link href="/ratings"><Button variant="ghost" size="sm" className="font-bold">View All</Button></Link>
            </CardHeader>
            <CardContent>
              {reviewsLoading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
                </div>
              ) : Array.isArray(reviews) && reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.slice(0, 3).map(review => (
                    <div key={review.id} className="bg-muted/30 p-4 rounded-xl border border-border/50">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-sm">{review.author}</span>
                        <div className="flex text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-current' : 'text-muted'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-foreground line-clamp-2">{review.body}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground font-medium text-center py-8">No reviews yet.</p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold">Top ASO Keywords</CardTitle>
              <Link href="/aso"><Button variant="ghost" size="sm" className="font-bold">Manage</Button></Link>
            </CardHeader>
            <CardContent>
              {asoLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 rounded-xl" />)}
                </div>
              ) : Array.isArray(asoKeywords) && asoKeywords.length > 0 ? (
                <div className="space-y-3">
                  {asoKeywords.slice(0, 5).map(kw => (
                    <div key={kw.id} className="flex items-center justify-between bg-muted/30 p-3 rounded-xl border border-border/50">
                      <span className="font-bold text-sm">{kw.keyword}</span>
                      <Badge variant="secondary" className="font-bold bg-primary/10 text-primary border-0">
                        Rank #{kw.rank || '-'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground font-medium text-center py-8">No tracked keywords.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function StatsCard({ icon: Icon, title, value, subtitle, color = "text-primary" }: any) {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-sm hover-elevate transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg bg-muted ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{title}</span>
      </div>
      <div className="text-3xl font-black text-foreground">{value}</div>
      {subtitle && <p className="text-xs text-muted-foreground mt-1 font-medium">{subtitle}</p>}
    </div>
  );
}
