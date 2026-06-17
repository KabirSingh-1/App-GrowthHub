import { AppLayout } from "@/components/layout/app-layout";
import { useListNotifications } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, Send, Clock, Edit2, Zap, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Notifications() {
  const { data: notifications, isLoading } = useListNotifications();

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">Push Notifications</h1>
            <p className="text-lg text-muted-foreground mt-2 font-medium">Engage users with targeted push messages.</p>
          </div>
          <Button className="rounded-xl font-bold shadow-sm hover-elevate">
            <Plus className="mr-2 h-5 w-5" /> New Message
          </Button>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-6 flex items-center justify-between gap-4 overflow-hidden relative">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, white 0%, transparent 60%)" }} />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-black text-white text-lg leading-tight">Powered by AppStorys</p>
              <p className="text-white/80 font-medium text-sm">AI-personalized in-app stories, push campaigns, and real-time segmentation — all in one platform.</p>
            </div>
          </div>
          <a href="https://appstorys.com" target="_blank" rel="noreferrer" className="relative z-10 flex-shrink-0">
            <Button variant="secondary" className="rounded-xl font-bold gap-2 bg-white text-violet-700 hover:bg-white/90">
              Learn more <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            [1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-3xl" />)
          ) : notifications && notifications.length > 0 ? (
            notifications.map(notif => (
              <div key={notif.id} className="bg-card rounded-3xl p-6 border border-border/50 shadow-sm hover-elevate transition-all group flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="outline" className={`rounded-lg border-0 px-3 py-1 font-bold ${
                    notif.status === 'sent' ? 'bg-accent/20 text-accent' : 
                    notif.status === 'scheduled' ? 'bg-secondary/20 text-secondary' : 
                    'bg-muted text-muted-foreground'
                  }`}>
                    {notif.status === 'sent' && <Send className="mr-1.5 h-3 w-3 inline" />}
                    {notif.status === 'scheduled' && <Clock className="mr-1.5 h-3 w-3 inline" />}
                    {notif.status.charAt(0).toUpperCase() + notif.status.slice(1)}
                  </Badge>
                  {notif.status !== 'sent' && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground rounded-lg">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <h3 className="font-bold text-lg mb-2 leading-tight">{notif.title}</h3>
                <p className="text-muted-foreground font-medium text-sm line-clamp-2 mb-6 flex-1">{notif.body}</p>
                
                {notif.status === 'sent' && notif.deliveredCount != null ? (
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/50 mt-auto">
                    <div>
                      <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Delivered</div>
                      <div className="font-black text-lg">{notif.deliveredCount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Open Rate</div>
                      <div className="font-black text-lg text-primary">{(notif.openRate ? (notif.openRate * 100).toFixed(1) : 0)}%</div>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-border/50 mt-auto flex items-center text-sm font-medium text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    {notif.scheduledAt ? new Date(notif.scheduledAt).toLocaleString() : 'Not scheduled'}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full p-12 text-center bg-card rounded-3xl border border-dashed border-border">
              <h3 className="text-xl font-bold mb-2">No messages yet</h3>
              <p className="text-muted-foreground font-medium mb-6">Create your first push notification campaign.</p>
              <Button className="rounded-xl font-bold shadow-sm hover-elevate">
                <Plus className="mr-2 h-5 w-5" /> Create Message
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
