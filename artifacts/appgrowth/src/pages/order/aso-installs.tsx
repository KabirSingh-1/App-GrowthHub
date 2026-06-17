import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useListApps, useCreateOrder } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { COUNTRIES, ASO_INSTALL_PRICE, ASO_INSTALL_QUANTITIES } from "@/constants";
import { cn } from "@/lib/utils";
import { CheckCircle, X, Search } from "lucide-react";

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
            s < current ? "bg-green-500 text-white" :
            s === current ? "bg-primary text-primary-foreground shadow-lg" :
            "bg-muted text-muted-foreground"
          )}>
            {s < current ? <CheckCircle className="h-4 w-4" /> : s}
          </div>
          {s < 3 && <div className={cn("h-0.5 w-12", s < current ? "bg-green-500" : "bg-muted")} />}
        </div>
      ))}
    </div>
  );
}

export default function OrderAsoInstalls() {
  const [step, setStep] = useState(1);
  const [appId, setAppId] = useState<number | null>(null);
  const [country, setCountry] = useState("US");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [kwInput, setKwInput] = useState("");
  const [installs, setInstalls] = useState(100);
  const [orderId, setOrderId] = useState<number | null>(null);

  const { data: apps } = useListApps();
  const createOrder = useCreateOrder({
    mutation: {
      onSuccess: (order) => {
        setOrderId(order.id);
        setStep(3);
      },
    },
  });

  const total = (installs * keywords.length * ASO_INSTALL_PRICE).toFixed(2);
  const selectedApp = apps?.find(a => a.id === appId);

  const addKeyword = () => {
    const kw = kwInput.trim();
    if (kw && !keywords.includes(kw) && keywords.length < 10) {
      setKeywords([...keywords, kw]);
      setKwInput("");
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight">ASO Keyword Installs</h1>
          <p className="text-muted-foreground mt-2">Drive installs through targeted keyword searches to boost organic ranking.</p>
        </div>

        <StepIndicator current={step} />

        {step === 1 && (
          <div className="bg-card rounded-3xl border border-border/50 p-8 space-y-6">
            <h2 className="text-2xl font-black">Choose your keywords</h2>

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

            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Keywords <span className="text-muted-foreground/50 normal-case font-normal">(max 10)</span></label>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-xl border border-border bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Type a keyword..."
                  value={kwInput}
                  onChange={e => setKwInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addKeyword(); } }}
                />
                <Button onClick={addKeyword} variant="outline" className="rounded-xl px-4" disabled={keywords.length >= 10}>
                  Add
                </Button>
              </div>
              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {keywords.map(kw => (
                    <span key={kw} className="flex items-center gap-1.5 bg-primary/10 text-primary rounded-lg px-3 py-1.5 text-sm font-semibold">
                      {kw}
                      <button onClick={() => setKeywords(keywords.filter(k => k !== kw))} className="hover:text-primary/60">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Select Country</label>
              <select
                className="w-full rounded-xl border border-border bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                value={country}
                onChange={e => setCountry(e.target.value)}
              >
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>

            <Button
              className="w-full rounded-xl font-bold text-base py-6"
              disabled={!appId || keywords.length === 0}
              onClick={() => setStep(2)}
            >
              Set Install Volume
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-card rounded-3xl border border-border/50 p-8 space-y-6">
            <h2 className="text-2xl font-black">Set install volume</h2>

            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Installs per keyword</label>
              <div className="flex flex-wrap gap-3">
                {ASO_INSTALL_QUANTITIES.map(q => (
                  <button
                    key={q}
                    onClick={() => setInstalls(q)}
                    className={cn(
                      "px-5 py-2.5 rounded-xl font-bold text-sm border-2 transition-all",
                      installs === q
                        ? "border-primary bg-primary text-primary-foreground shadow-md scale-105"
                        : "border-border bg-background hover:border-primary/50"
                    )}
                  >
                    {q.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left px-4 py-3 font-bold text-muted-foreground">Keyword</th>
                    <th className="text-right px-4 py-3 font-bold text-muted-foreground">Installs</th>
                    <th className="text-right px-4 py-3 font-bold text-muted-foreground">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {keywords.map((kw, i) => (
                    <tr key={kw} className={cn("border-t border-border", i % 2 === 0 ? "bg-background" : "bg-muted/20")}>
                      <td className="px-4 py-3 font-medium">{kw}</td>
                      <td className="px-4 py-3 text-right">{installs.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-semibold">${(installs * ASO_INSTALL_PRICE).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-primary/5 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-muted-foreground">Total</p>
                <p className="text-4xl font-black text-primary">${total}</p>
                <p className="text-xs text-muted-foreground mt-1">{installs.toLocaleString()} installs × {keywords.length} keywords × ${ASO_INSTALL_PRICE}</p>
              </div>
              <Search className="h-10 w-10 text-primary/20" />
            </div>

            <Button
              className="w-full rounded-xl font-bold text-base py-6"
              disabled={createOrder.isPending}
              onClick={() => {
                if (!appId) return;
                createOrder.mutate({
                  data: {
                    appId,
                    serviceType: "aso_installs",
                    country,
                    quantity: installs,
                    keywords: keywords.join(","),
                    amount: parseFloat(total),
                  },
                });
              }}
            >
              {createOrder.isPending ? "Placing order..." : "Place Order"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Payments coming soon — your order will be confirmed manually.
            </p>
            <button onClick={() => setStep(1)} className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors">
              Back to keywords
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="bg-card rounded-3xl border border-border/50 p-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <div>
              <h2 className="text-3xl font-black">Order #{orderId} placed!</h2>
              <p className="text-muted-foreground mt-2 text-lg">We'll kick off your keyword campaigns within 24 hours.</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Link href="/orders">
                <Button className="rounded-xl font-bold">View My Orders</Button>
              </Link>
              <Button variant="outline" className="rounded-xl font-bold" onClick={() => { setStep(1); setAppId(null); setKeywords([]); setInstalls(100); }}>
                Order More
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
