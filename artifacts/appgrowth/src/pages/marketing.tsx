import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useListApps, useCreateOrder } from "@/lib/mock-api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle, Megaphone, Search } from "lucide-react";

type Tab = "meta_ads" | "apple_search_ads";

const META_FEATURES = [
  "Creative design included",
  "Weekly performance reporting",
  "Dedicated media buyer",
  "Install-optimized campaigns",
  "5% management fee only",
];

const APPLE_FEATURES = [
  "Integrated Apple Search Ads partner",
  "DSP and programmatic support",
  "Keyword and audience targeting",
  "Campaign brief uploads",
  "Priority keyword bidding",
];

export default function Marketing() {
  const [tab, setTab] = useState<Tab>("meta_ads");
  const [appId, setAppId] = useState<number | null>(null);
  const [budget, setBudget] = useState("");
  const [audience, setAudience] = useState("");
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

  const handleSubmit = () => {
    if (!appId) return;
    createOrder.mutate({
      data: {
        appId,
        serviceType: tab,
        amount: parseFloat(budget) * 0.05 || 0,
        notes: audience || undefined,
      },
    });
  };

  return (
    <AppLayout>
      <div className="space-y-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Marketing</h1>
          <p className="text-muted-foreground mt-2 text-lg">Managed paid acquisition through Meta and Apple Search Ads.</p>
        </div>

        <div className="flex gap-2">
          {([
            { id: "meta_ads" as Tab, label: "Meta Ads", icon: Megaphone },
            { id: "apple_search_ads" as Tab, label: "Apple Search Ads", icon: Search },
          ]).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setTab(id); setSubmitted(false); }}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all",
                tab === id ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-black">
                {tab === "meta_ads" ? "Managed Meta Ads" : "Apple Search Ads"}
              </h2>
              <p className="text-muted-foreground mt-2 text-lg">
                {tab === "meta_ads"
                  ? "5% management fee. No contracts. Pause anytime."
                  : "Reach users at the exact moment they're searching."}
              </p>
            </div>

            <ul className="space-y-3">
              {(tab === "meta_ads" ? META_FEATURES : APPLE_FEATURES).map(f => (
                <li key={f} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="font-medium">{f}</span>
                </li>
              ))}
            </ul>

            {tab === "meta_ads" && (
              <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">Management Fee</p>
                <p className="text-4xl font-black text-primary">5%</p>
                <p className="text-sm text-muted-foreground mt-1">of your monthly ad spend. No setup fees.</p>
              </div>
            )}
          </div>

          <div className="bg-card rounded-3xl border border-border/50 p-8">
            {submitted ? (
              <div className="text-center space-y-4 py-8">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-black">Interest logged!</h3>
                <p className="text-muted-foreground">Our team will reach out within 1 business day to discuss your campaign.</p>
                <p className="text-sm text-muted-foreground">Order ref: #{orderId}</p>
                <Button variant="outline" className="rounded-xl font-bold" onClick={() => { setSubmitted(false); setAppId(null); setBudget(""); setAudience(""); }}>
                  Submit Another
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                <h3 className="text-xl font-black">Get Started</h3>

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
                  <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Monthly Budget (USD)</label>
                  <input
                    type="number"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g. 2000"
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                  />
                  {budget && parseFloat(budget) > 0 && (
                    <p className="text-xs text-muted-foreground">Management fee: ${(parseFloat(budget) * 0.05).toFixed(0)}/mo</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Target Audience</label>
                  <textarea
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows={3}
                    placeholder="Describe your ideal user: age, interests, location, behavior..."
                    value={audience}
                    onChange={e => setAudience(e.target.value)}
                  />
                </div>

                <Button
                  className="w-full rounded-xl font-bold text-base py-6"
                  disabled={!appId || createOrder.isPending}
                  onClick={handleSubmit}
                >
                  {createOrder.isPending ? "Submitting..." : "Submit Interest"}
                </Button>
                <p className="text-center text-xs text-muted-foreground">Our team will contact you within 1 business day.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
