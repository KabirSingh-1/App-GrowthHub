import { Link, useLocation } from "wouter";
import { LayoutDashboard, AppWindow, Star, Target, Megaphone, Search, Bell, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Apps", href: "/apps", icon: AppWindow },
  { name: "Ratings", href: "/ratings", icon: Star },
  { name: "Acquisition", href: "/acquisition", icon: Target },
  { name: "Ads Creative", href: "/ads", icon: Megaphone },
  { name: "ASO", href: "/aso", icon: Search },
  { name: "Notifications", href: "/notifications", icon: Bell },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="p-6">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
              AG
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">AppGrowth</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.startsWith(item.href) && (item.href !== '/' || location === '/');
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer group hover-elevate",
                  isActive
                    ? "bg-primary text-primary-foreground font-medium shadow-sm"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                {item.name}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Link href="/settings">
          <div
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer group hover-elevate",
              location === "/settings"
                ? "bg-primary text-primary-foreground font-medium shadow-sm"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            <Settings className="h-5 w-5" />
            Settings
          </div>
        </Link>
      </div>
    </div>
  );
}
