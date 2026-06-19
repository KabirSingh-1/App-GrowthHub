import { Link, useLocation } from "wouter";
import { LayoutDashboard, AppWindow, Star, Search, Play, Bell, Megaphone, ShoppingBag, Settings, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const mainNav = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Apps", href: "/apps", icon: AppWindow },
];

const serviceNav = [
  { name: "Ratings & Reviews", href: "/ratings", icon: Star },
  { name: "AI Reply to Reviews", href: "/order/reply-to-reviews", icon: MessageSquare },
  { name: "ASO Installs", href: "/order/aso-installs", icon: Search },
  { name: "UGC Videos", href: "/order/videos", icon: Play },
  { name: "Get AppStorys", href: "/notifications", icon: Bell },
  { name: "Meta Ads", href: "/marketing", icon: Megaphone },
  { name: "Apple Search Ads", href: "/order/apple-search-ads", icon: Search },
];

export function Sidebar() {
  const [location] = useLocation();

  const isActive = (href: string) =>
    location === href || (href !== "/" && location.startsWith(href));

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="p-6">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-sm tracking-tight">
              AV
            </div>
            <span className="font-black text-xl tracking-tight text-foreground">AppVersal</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 pb-4 overflow-y-auto space-y-1">
        {mainNav.map((item) => (
          <Link key={item.name} href={item.href}>
            <div className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer",
              isActive(item.href)
                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}>
              <item.icon className="h-4 w-4" />
              {item.name}
            </div>
          </Link>
        ))}

        <div className="pt-3 pb-1 px-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Services</p>
        </div>

        {serviceNav.map((item) => (
          <Link key={item.name} href={item.href}>
            <div className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer",
              isActive(item.href)
                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}>
              <item.icon className="h-4 w-4" />
              {item.name}
            </div>
          </Link>
        ))}

        <div className="pt-3 pb-1 px-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Account</p>
        </div>

        <Link href="/orders">
          <div className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer",
            isActive("/orders")
              ? "bg-primary text-primary-foreground font-semibold shadow-sm"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          )}>
            <ShoppingBag className="h-4 w-4" />
            My Orders
          </div>
        </Link>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Link href="/settings">
          <div className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer",
            location === "/settings"
              ? "bg-primary text-primary-foreground font-semibold shadow-sm"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          )}>
            <Settings className="h-4 w-4" />
            Settings
          </div>
        </Link>
      </div>
    </div>
  );
}
