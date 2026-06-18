import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useListApps, useCreateOrder } from "@/lib/mock-api";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { COUNTRIES, RATING_PRICE, RATING_QUANTITIES } from "@/constants";
import { cn } from "@/lib/utils";
import { CheckCircle, Star } from "lucide-react";

function StepIndicator({ step, current }: { step: number; current: number }) {
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

export default function OrderRatings() {
  const [step, setStep] = useState(1);
  const [appId, setAppId] = useState<number | null>(null);
  const [country, setCountry] = useState("US");
  const [quantity, setQuantity] = useState(50);
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

  const total = (quantity * RATING_PRICE).toFixed(2);
  const selectedApp = Array.isArray(apps) ? apps.find(a => a.id === appId) : undefined;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Order Ratings</h1>
          <p className="text-muted-foreground mt-2">Boost your app's star rating with real, high-quality reviews.</p>
        </div>

        <StepIndicator step={3} current={step} />

        {step === 1 && (
          <div className="bg-card rounded-3xl border border-border/50 p-8 space-y-6">
            <h2 className="text-2xl font-black">Configure your order</h2>

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

            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Number of Ratings</label>
              <div className="flex flex-wrap gap-3">
                {RATING_QUANTITIES.map(q => (
                  <button
                    key={q}
                    onClick={() => setQuantity(q)}
                    className={cn(
                      "px-5 py-2.5 rounded-xl font-bold text-sm border-2 transition-all",
                      quantity === q
                        ? "border-primary bg-primary text-primary-foreground shadow-md scale-105"
                        : "border-border bg-background hover:border-primary/50"
                    )}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-primary/5 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-muted-foreground">Total Price</p>
                <p className="text-4xl font-black text-primary">${total}</p>
                <p className="text-xs text-muted-foreground mt-1">{quantity} ratings × ${RATING_PRICE}/rating</p>
              </div>
              <Star className="h-10 w-10 text-primary/20" />
            </div>

            <Button
              className="w-full rounded-xl font-bold text-base py-6"
              disabled={!appId}
              onClick={() => setStep(2)}
            >
              Review Order
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-card rounded-3xl border border-border/50 p-8 space-y-6">
            <h2 className="text-2xl font-black">Review your order</h2>

            <div className="bg-muted/30 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">App</span>
                <span className="font-bold">{selectedApp?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Country</span>
                <span className="font-bold">{COUNTRIES.find(c => c.code === country)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Ratings</span>
                <span className="font-bold">{quantity}</span>
              </div>
              <div className="border-t border-border pt-4 flex justify-between">
                <span className="font-black text-lg">Total</span>
                <span className="font-black text-2xl text-primary">${total}</span>
              </div>
            </div>

            <Button
              className="w-full rounded-xl font-bold text-base py-6"
              disabled={createOrder.isPending}
              onClick={() => {
                if (!appId) return;
                createOrder.mutate({
                  data: {
                    appId,
                    serviceType: "ratings",
                    country,
                    quantity,
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
              Back to configure
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="bg-card rounded-3xl border border-border/50 p-8 text-center space-y-6">
            <div className="relative">
              <div className="confetti-container">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="confetti-piece" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s`, backgroundColor: ['#7c3aed','#10b981','#f59e0b','#ef4444','#3b82f6'][i % 5] }} />
                ))}
              </div>
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-black">Order #{orderId} placed!</h2>
              <p className="text-muted-foreground mt-2 text-lg">We'll start processing within 24 hours.</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Link href="/orders">
                <Button className="rounded-xl font-bold">View My Orders</Button>
              </Link>
              <Button variant="outline" className="rounded-xl font-bold" onClick={() => { setStep(1); setAppId(null); setQuantity(50); }}>
                Order More
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
