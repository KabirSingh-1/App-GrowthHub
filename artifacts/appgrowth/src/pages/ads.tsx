import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Sparkles, Video, Image as ImageIcon, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AdsCreative() {
  return (
    <AppLayout>
      <div className="space-y-12 max-w-5xl mx-auto">
        <div className="text-center space-y-4 py-8">
          <Badge className="bg-primary/10 text-primary border-0 rounded-full px-4 py-1 mb-4 font-bold uppercase tracking-widest text-xs">Premium Service</Badge>
          <h1 className="text-5xl font-black tracking-tight text-foreground">High-Converting Ad Creatives</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Stop guessing what works. Order custom Meta & TikTok ad creatives designed by growth experts to lower your CPI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="rounded-3xl border border-border/50 shadow-sm overflow-hidden bg-card hover-elevate transition-all group cursor-pointer relative">
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full z-10">Most Popular</div>
            <div className="h-48 bg-muted relative overflow-hidden flex items-center justify-center">
              <Video className="w-16 h-16 text-muted-foreground/30 group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white font-bold text-xl">Video Pack</div>
            </div>
            <CardContent className="p-8">
              <div className="text-3xl font-black mb-2">$899</div>
              <p className="text-muted-foreground font-medium mb-6">3 custom UGC-style videos + 2 iterations. Perfect for TikTok and Reels.</p>
              <ul className="space-y-3 mb-8 font-medium">
                <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Script writing included</li>
                <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Real creators, native feel</li>
                <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> 5-day turnaround</li>
              </ul>
              <Button className="w-full rounded-xl font-bold h-12 text-lg">Order Video Pack <ArrowRight className="ml-2 h-5 w-5" /></Button>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-border/50 shadow-sm overflow-hidden bg-card hover-elevate transition-all group cursor-pointer">
            <div className="h-48 bg-muted relative overflow-hidden flex items-center justify-center">
              <ImageIcon className="w-16 h-16 text-muted-foreground/30 group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white font-bold text-xl">Static Pack</div>
            </div>
            <CardContent className="p-8">
              <div className="text-3xl font-black mb-2">$499</div>
              <p className="text-muted-foreground font-medium mb-6">5 high-impact static image creatives. Ideal for Meta feed and stories.</p>
              <ul className="space-y-3 mb-8 font-medium">
                <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-secondary" /> Copywriting included</li>
                <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-secondary" /> Multiple aspect ratios</li>
                <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-secondary" /> 3-day turnaround</li>
              </ul>
              <Button variant="outline" className="w-full rounded-xl font-bold h-12 text-lg">Order Static Pack <ArrowRight className="ml-2 h-5 w-5" /></Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function Badge({ className, children, ...props }: any) {
  return <div className={`inline-flex items-center border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`} {...props}>{children}</div>
}
