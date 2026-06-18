import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useCreateOrder } from "@/lib/mock-api";
import { getApps, StoredApp } from "@/lib/app-store";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { COUNTRIES, RATING_PRICE } from "@/constants";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import { FaApple, FaAndroid } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Ratings() {
  const [, setLocation] = useLocation();
  const [appId, setAppId] = useState<string | null>(null);
  const [totalRating, setTotalRating] = useState<number | "">("");
  const [country, setCountry] = useState("US");
  const [platform, setPlatform] = useState<"ios" | "android">("ios");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [apps, setApps] = useState<StoredApp[]>([]);

  useEffect(() => {
    setApps(getApps());
  }, []);
  const createOrder = useCreateOrder({
    mutation: {
      onSuccess: (order) => {
        setOrderId(order.id);
      },
    },
  });

  const quantity = Number(totalRating) || 0;
  const currentPrice = country === "IN" ? 0.5 : 3.5;
  const total = (quantity * currentPrice).toFixed(2);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Order Ratings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Improve your app store ranking with high-quality ratings.
          </p>
        </div>

        {orderId ? (
          <div className="bg-card rounded-lg border border-border p-8 text-center space-y-4">
            <CheckCircle className="h-10 w-10 text-green-500 mx-auto" />
            <div>
              <h2 className="text-xl font-medium">Order Confirmed</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Order #{orderId} has been placed successfully.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-4">
              <Link href="/orders">
                <Button variant="outline">View Orders</Button>
              </Link>
              <Button
                onClick={() => {
                  setOrderId(null);
                  setAppId(null);
                  setTotalRating("");
                }}
              >
                Create Another Order
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-x-8 gap-y-6 items-start">
              
              {/* 1. App Selection */}
              <label className="text-sm font-medium text-foreground md:mt-2">
                App
              </label>
              <Select
                value={appId || ""}
                onValueChange={(value) => {
                  setAppId(value);
                  const selectedApp = apps.find(a => a.id === value);
                  if (selectedApp) {
                    setPlatform(selectedApp.platform === "iOS" ? "ios" : "android");
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an app" />
                </SelectTrigger>
                <SelectContent>
                  {apps.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      No apps found. Please add an app in "My Apps".
                    </SelectItem>
                  ) : (
                    apps.map((app) => (
                      <SelectItem key={app.id} value={app.id}>
                        {app.name} ({app.platform})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              {/* 2. Total Rating */}
              <label className="text-sm font-medium text-foreground md:mt-2">
                Total Ratings
              </label>
              <input
                type="number"
                min="1"
                placeholder="e.g., 50"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={totalRating}
                onChange={(e) => setTotalRating(e.target.value ? Number(e.target.value) : "")}
              />

              {/* 3. Country Code */}
              <label className="text-sm font-medium text-foreground md:mt-2">
                Country
              </label>
              <Select
                value={country}
                onValueChange={setCountry}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.filter(c => ["US", "GB", "CA", "IN", "AU"].includes(c.code)).map((c) => {
                    const flag = c.code.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397));
                    return (
                      <SelectItem key={c.code} value={c.code}>
                        <span className="mr-2 text-lg">{flag}</span> {c.name} ({c.code})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              {/* 4. Platform */}
              <label className="text-sm font-medium text-foreground md:mt-2">
                Platform
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPlatform("ios")}
                  className={cn(
                    "flex items-center justify-center gap-2 h-10 rounded-md border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    platform === "ios"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground hover:bg-muted"
                  )}
                >
                  <FaApple className="h-4 w-4" /> iOS
                </button>
                <button
                  onClick={() => setPlatform("android")}
                  className={cn(
                    "flex items-center justify-center gap-2 h-10 rounded-md border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    platform === "android"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground hover:bg-muted"
                  )}
                >
                  <FaAndroid className="h-4 w-4" /> Android
                </button>
              </div>

              {/* Summary & Submit */}
              <div className="col-span-1 md:col-span-2 mt-4 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Total</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold">${total}</span>
                    <span className="text-sm text-muted-foreground">
                      ({quantity} ratings × ${currentPrice})
                    </span>
                  </div>
                </div>
                
                <Button
                  className="w-full sm:w-auto"
                  disabled={!appId || !quantity}
                  onClick={() => {
                    if (!appId || !quantity) return;
                    setLocation(`/payment?amount=${total}&service=Ratings`);
                  }}
                >
                  Place Order
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
