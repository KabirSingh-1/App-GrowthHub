import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useListApps, useCreateOrder } from "@/lib/mock-api";
import { Button } from "@/components/ui/button";
import { AI_VIDEO_PRICE, NON_AI_VIDEO_PRICE } from "@/constants";
import { cn } from "@/lib/utils";
import { Play, CheckCircle, Zap, Users } from "lucide-react";

const portfolioItems = [
  { title: "Fitness App Launch — 3-Hook Series", type: "AI UGC", gradient: "from-violet-500 to-purple-700" },
  { title: "Finance App — Trust & Credibility", type: "Non-AI UGC", gradient: "from-emerald-400 to-teal-600" },
  { title: "Productivity Tool — Problem/Solution", type: "AI UGC", gradient: "from-orange-400 to-coral-600" },
];

export default function OrderVideos() {
  const [videoType, setVideoType] = useState<"ai" | "non_ai">("ai");
  const [appId, setAppId] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const { data: apps } = useListApps();
  const createOrder = useCreateOrder({
    mutation: {
      onSuccess: (order) => {
        setOrderId(order.id);
        setSubmitted(true);
      },
    },
  });

  const price = videoType === "ai" ? AI_VIDEO_PRICE : NON_AI_VIDEO_PRICE;

  return (
    <AppLayout>
      <div className="space-y-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight">UGC Videos</h1>
          <p className="text-muted-foreground mt-2 text-lg">Scroll-stopping video ads built for mobile app installs.</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-black text-muted-foreground uppercase tracking-widest text-sm">Portfolio</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {portfolioItems.map((item, i) => (
              <div key={i} className="rounded-3xl overflow-hidden border border-border/50 shadow-sm group cursor-pointer hover-elevate">
                <div className={cn("bg-gradient-to-br h-44 flex items-center justify-center relative", item.gradient)}>
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 text-white ml-1" />
                  </div>
                </div>
                <div className="bg-card p-4">
                  <p className="font-bold text-sm leading-tight">{item.title}</p>
                  <span className={cn("inline-block mt-2 text-xs font-bold px-2.5 py-1 rounded-full", item.type === "AI UGC" ? "bg-violet-100 text-violet-700" : "bg-emerald-100 text-emerald-700")}>
                    {item.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={cn("rounded-3xl border-2 p-8 cursor-pointer transition-all", videoType === "ai" ? "border-primary bg-primary/5 shadow-lg" : "border-border bg-card hover:border-primary/30")}
            onClick={() => setVideoType("ai")}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                <Zap className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <div className="font-black text-xl">AI UGC Video</div>
                <div className="text-3xl font-black text-primary">${AI_VIDEO_PRICE}</div>
              </div>
            </div>
            <p className="text-muted-foreground font-medium mb-4">Script-to-video in 48 hours. Multiple hooks. A/B ready.</p>
            <ul className="space-y-2">
              {["AI actor & voiceover", "Captions included", "3 hook variations", "48hr delivery"].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className={cn("rounded-3xl border-2 p-8 cursor-pointer transition-all", videoType === "non_ai" ? "border-primary bg-primary/5 shadow-lg" : "border-border bg-card hover:border-primary/30")}
            onClick={() => setVideoType("non_ai")}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <div className="font-black text-xl">Non-AI UGC Video</div>
                <div className="text-3xl font-black text-primary">${NON_AI_VIDEO_PRICE}</div>
              </div>
            </div>
            <p className="text-muted-foreground font-medium mb-4">Real creator. Real face. Real trust.</p>
            <ul className="space-y-2">
              {["Human creator", "1 polished variation", "5–7 day delivery", "Usage rights included"].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {!submitted ? (
          <div className="bg-card rounded-3xl border border-border/50 p-8 space-y-6 max-w-xl">
            <h2 className="text-2xl font-black">Place your order</h2>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Select App</label>
              <select
                className="w-full rounded-xl border border-border bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                value={appId ?? ""}
                onChange={e => setAppId(Number(e.target.value))}
              >
                <option value="">Choose an app...</option>
                {apps?.map(app => (
                  <option key={app.id} value={app.id}>{app.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Describe your app</label>
              <textarea
                className="w-full rounded-xl border border-border bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={4}
                placeholder="What does your app do? Who is it for? Any specific talking points or hooks you want included?"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            <div className="bg-primary/5 rounded-2xl p-4 flex items-center justify-between">
              <span className="font-bold">{videoType === "ai" ? "AI UGC Video" : "Non-AI UGC Video"}</span>
              <span className="text-2xl font-black text-primary">${price}</span>
            </div>

            <Button
              className="w-full rounded-xl font-bold text-base py-6"
              disabled={!appId || createOrder.isPending}
              onClick={() => {
                if (!appId) return;
                createOrder.mutate({
                  data: {
                    appId,
                    serviceType: videoType === "ai" ? "ai_ugc_video" : "non_ai_ugc_video",
                    amount: price,
                    notes: notes || undefined,
                  },
                });
              }}
            >
              {createOrder.isPending ? "Placing order..." : `Place Order — $${price}`}
            </Button>
            <p className="text-center text-sm text-muted-foreground">Payments coming soon — your order will be confirmed manually.</p>
          </div>
        ) : (
          <div className="bg-card rounded-3xl border border-border/50 p-8 text-center space-y-4 max-w-xl">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-black">Order #{orderId} placed!</h2>
            <p className="text-muted-foreground">Our creative team will reach out within 24 hours to kick things off.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
