import { AppLayout } from "@/components/layout/app-layout";
import { useListCampaigns } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Acquisition() {
  const { data: campaigns, isLoading } = useListCampaigns();

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">User Acquisition</h1>
            <p className="text-lg text-muted-foreground mt-2 font-medium">Manage and track your ad campaigns.</p>
          </div>
          <Button className="rounded-xl font-bold shadow-sm hover-elevate">
            <Plus className="mr-2 h-5 w-5" /> New Campaign
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-2xl border-border/50 bg-primary text-primary-foreground border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider opacity-90">Total Spend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black">$4,250</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/50 bg-card shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Installs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black">12,405</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/50 bg-card shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Avg CPI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black">$0.34</div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border/50 flex justify-between items-center">
            <h2 className="text-xl font-bold">Active Campaigns</h2>
            <Button variant="outline" size="sm" className="rounded-xl font-bold"><BarChart3 className="mr-2 h-4 w-4" /> Reports</Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/50 text-sm font-bold text-muted-foreground uppercase tracking-wider bg-muted/20">
                  <th className="p-4">Campaign</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Network</th>
                  <th className="p-4 text-right">Spend</th>
                  <th className="p-4 text-right">Installs</th>
                  <th className="p-4 text-right">CPI</th>
                  <th className="p-4 text-right">CTR</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {isLoading ? (
                  [1, 2, 3].map(i => (
                    <tr key={i} className="border-b border-border/10">
                      <td className="p-4"><Skeleton className="h-6 w-32" /></td>
                      <td className="p-4"><Skeleton className="h-6 w-16" /></td>
                      <td className="p-4"><Skeleton className="h-6 w-24" /></td>
                      <td className="p-4"><Skeleton className="h-6 w-16 ml-auto" /></td>
                      <td className="p-4"><Skeleton className="h-6 w-16 ml-auto" /></td>
                      <td className="p-4"><Skeleton className="h-6 w-16 ml-auto" /></td>
                      <td className="p-4"><Skeleton className="h-6 w-16 ml-auto" /></td>
                    </tr>
                  ))
                ) : campaigns && campaigns.length > 0 ? (
                  campaigns.map(camp => (
                    <tr key={camp.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors font-medium">
                      <td className="p-4 font-bold text-foreground">{camp.name}</td>
                      <td className="p-4">
                        <Badge variant="outline" className={`rounded-lg border-0 ${camp.status === 'active' ? 'bg-accent/20 text-accent' : 'bg-muted text-muted-foreground'}`}>
                          {camp.status}
                        </Badge>
                      </td>
                      <td className="p-4 uppercase text-xs tracking-wider font-bold">{camp.type.replace('_', ' ')}</td>
                      <td className="p-4 text-right">${camp.spend.toLocaleString()}</td>
                      <td className="p-4 text-right font-bold">{camp.installs.toLocaleString()}</td>
                      <td className="p-4 text-right">${camp.cpi?.toFixed(2) || 'N/A'}</td>
                      <td className="p-4 text-right text-primary font-bold">{(camp.ctr ? (camp.ctr * 100).toFixed(1) : 0)}%</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground font-medium">No campaigns found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
