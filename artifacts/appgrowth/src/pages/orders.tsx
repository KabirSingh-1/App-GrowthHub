import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useListOrders, useListApps, useCreateOrder, useDeleteOrder } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListOrdersQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { SERVICE_LABELS, STATUS_COLORS } from "@/constants";
import { cn } from "@/lib/utils";
import { Star, Search, Play, Bell, Megaphone, Video, RefreshCw, Copy, Trash2, ChevronDown, ShoppingBag } from "lucide-react";

const SERVICE_ICONS: Record<string, React.ElementType> = {
  ratings: Star,
  aso_installs: Search,
  ai_ugc_video: Play,
  non_ai_ugc_video: Video,
  push_notifications: Bell,
  meta_ads: Megaphone,
  apple_search_ads: Search,
};

const STATUS_TABS = ["all", "pending", "in_progress", "completed", "cancelled"] as const;
type StatusTab = typeof STATUS_TABS[number];

export default function Orders() {
  const [activeTab, setActiveTab] = useState<StatusTab>("all");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [showNewOrder, setShowNewOrder] = useState(false);

  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useListOrders();
  const { data: apps } = useListApps();

  const createOrder = useCreateOrder({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() }),
    },
  });
  const deleteOrder = useDeleteOrder({
    mutation: {
      onSuccess: () => {
        setDeletingId(null);
        queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
      },
    },
  });

  const appName = (appId: number) => apps?.find(a => a.id === appId)?.name ?? `App #${appId}`;

  const filtered = orders?.filter(o =>
    activeTab === "all" ? true : o.status === activeTab
  ) ?? [];

  const detailOrder = orders?.find(o => o.id === selectedOrder);

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight">My Orders</h1>
            <p className="text-muted-foreground mt-2 font-medium">Track and manage all your service orders.</p>
          </div>
          <div className="relative">
            <Button className="rounded-xl font-bold gap-2" onClick={() => setShowNewOrder(!showNewOrder)}>
              New Order <ChevronDown className="h-4 w-4" />
            </Button>
            {showNewOrder && (
              <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-2xl shadow-xl z-10 overflow-hidden min-w-48">
                {[
                  { label: "Ratings", href: "/ratings" },
                  { label: "ASO Installs", href: "/order/aso-installs" },
                  { label: "UGC Video", href: "/order/videos" },
                ].map(item => (
                  <Link key={item.label} href={item.href}>
                    <div className="px-4 py-3 hover:bg-muted/50 cursor-pointer font-medium text-sm">{item.label}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {STATUS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all",
                activeTab === tab ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              {tab === "in_progress" ? "In Progress" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab !== "all" && orders && (
                <span className="ml-1.5 text-xs opacity-70">
                  {orders.filter(o => o.status === tab).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-muted/30 rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-black mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-6">Start growing your app with Ratings or ASO Installs.</p>
            <div className="flex gap-3 justify-center">
              <Link href="/ratings"><Button className="rounded-xl font-bold">Order Ratings</Button></Link>
              <Link href="/order/aso-installs"><Button variant="outline" className="rounded-xl font-bold">ASO Installs</Button></Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(order => {
              const Icon = SERVICE_ICONS[order.serviceType] ?? Star;
              return (
                <div
                  key={order.id}
                  className="bg-card rounded-2xl border border-border/50 p-5 flex items-center gap-4 hover:border-border transition-all cursor-pointer group"
                  onClick={() => setSelectedOrder(order.id === selectedOrder ? null : order.id)}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold truncate">{SERVICE_LABELS[order.serviceType] ?? order.serviceType}</div>
                    <div className="text-sm text-muted-foreground font-medium">
                      {appName(order.appId)}
                      {order.country && ` · ${order.country}`}
                      {order.quantity && ` · ${order.quantity.toLocaleString()}`}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-black text-lg">${order.amount.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                  <span className={cn("px-3 py-1 rounded-full text-xs font-bold flex-shrink-0", STATUS_COLORS[order.status] ?? "bg-muted text-muted-foreground")}>
                    {order.status === "in_progress" ? "In Progress" : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                    <button
                      title="Restart"
                      className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => createOrder.mutate({ data: { appId: order.appId, serviceType: order.serviceType, country: order.country ?? undefined, quantity: order.quantity ?? undefined, amount: order.amount, keywords: order.keywords ?? undefined, notes: order.notes ?? undefined } })}
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                    <button
                      title="Copy"
                      className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => createOrder.mutate({ data: { appId: order.appId, serviceType: order.serviceType, country: order.country ?? undefined, quantity: order.quantity ?? undefined, amount: order.amount, keywords: order.keywords ?? undefined, notes: order.notes ?? undefined } })}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      title="Delete"
                      className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors"
                      onClick={() => {
                        if (deletingId === order.id) {
                          deleteOrder.mutate({ orderId: order.id });
                        } else {
                          setDeletingId(order.id);
                          setTimeout(() => setDeletingId(null), 3000);
                        }
                      }}
                    >
                      {deletingId === order.id ? (
                        <span className="text-xs font-bold text-red-500">Sure?</span>
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {detailOrder && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
            <div className="bg-card rounded-3xl border border-border p-8 max-w-md w-full space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">Order #{detailOrder.id}</h2>
                <button onClick={() => setSelectedOrder(null)} className="text-muted-foreground hover:text-foreground">
                  <span className="text-2xl leading-none">&times;</span>
                </button>
              </div>
              {[
                ["Service", SERVICE_LABELS[detailOrder.serviceType] ?? detailOrder.serviceType],
                ["App", appName(detailOrder.appId)],
                ["Status", detailOrder.status],
                ["Country", detailOrder.country],
                ["Quantity", detailOrder.quantity?.toLocaleString()],
                ["Keywords", detailOrder.keywords],
                ["Amount", `$${detailOrder.amount.toFixed(2)}`],
                ["Notes", detailOrder.notes],
                ["Created", new Date(detailOrder.createdAt).toLocaleString()],
              ].filter(([, v]) => v != null).map(([label, value]) => (
                <div key={label as string} className="flex justify-between items-start gap-4">
                  <span className="text-muted-foreground font-medium text-sm">{label}</span>
                  <span className="font-bold text-sm text-right max-w-xs">{value as string}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
