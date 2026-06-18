import { AppLayout } from "@/components/layout/app-layout";
import { useListAsoKeywords } from "@/lib/mock-api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Aso() {
  const { data: keywords, isLoading } = useListAsoKeywords();

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">App Store Optimization</h1>
            <p className="text-lg text-muted-foreground mt-2 font-medium">Track your rankings and discover new keyword opportunities.</p>
          </div>
          <Button className="rounded-xl font-bold shadow-sm hover-elevate">
            <Plus className="mr-2 h-5 w-5" /> Add Keywords
          </Button>
        </div>

        <div className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-bold">Keyword Tracker</h2>
            <div className="flex gap-3">
              <Input placeholder="Search keywords..." className="w-64 rounded-xl bg-muted/50 border-transparent focus-visible:bg-background" />
              <select className="h-10 px-3 py-2 rounded-xl bg-muted/50 border-transparent text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option>All Apps</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/50 text-sm font-bold text-muted-foreground uppercase tracking-wider bg-muted/20">
                  <th className="p-4 pl-6">Keyword</th>
                  <th className="p-4 text-center">Rank</th>
                  <th className="p-4 text-right">Volume</th>
                  <th className="p-4 text-center">Difficulty</th>
                  <th className="p-4 pr-6 text-right">Traffic Share</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {isLoading ? (
                  [1, 2, 3, 4, 5].map(i => (
                    <tr key={i} className="border-b border-border/10">
                      <td className="p-4 pl-6"><Skeleton className="h-6 w-32" /></td>
                      <td className="p-4"><Skeleton className="h-6 w-12 mx-auto" /></td>
                      <td className="p-4"><Skeleton className="h-6 w-16 ml-auto" /></td>
                      <td className="p-4"><Skeleton className="h-6 w-16 mx-auto" /></td>
                      <td className="p-4 pr-6"><Skeleton className="h-6 w-16 ml-auto" /></td>
                    </tr>
                  ))
                ) : Array.isArray(keywords) && keywords.length > 0 ? (
                  keywords.map((kw, i) => (
                    <tr key={kw.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors font-medium">
                      <td className="p-4 pl-6 font-bold text-foreground text-base">{kw.keyword}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className={`font-black text-lg ${kw.rank && kw.rank <= 10 ? 'text-primary' : 'text-foreground'}`}>
                            {kw.rank || '-'}
                          </span>
                          {i % 3 === 0 ? <ArrowUpRight className="h-4 w-4 text-accent" /> : i % 3 === 1 ? <ArrowDownRight className="h-4 w-4 text-destructive" /> : <Minus className="h-4 w-4 text-muted-foreground" />}
                        </div>
                      </td>
                      <td className="p-4 text-right font-bold">{kw.volume.toLocaleString()}</td>
                      <td className="p-4 text-center">
                        <div className="w-16 h-2 bg-muted rounded-full mx-auto overflow-hidden">
                          <div className={`h-full ${kw.difficulty > 70 ? 'bg-destructive' : kw.difficulty > 40 ? 'bg-secondary' : 'bg-accent'}`} style={{ width: `${kw.difficulty}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground mt-1 block">{kw.difficulty}/100</span>
                      </td>
                      <td className="p-4 pr-6 text-right font-bold text-primary">
                        {kw.traffic ? `${kw.traffic}%` : '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground font-medium">No keywords tracked. Add some to get started.</td>
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
