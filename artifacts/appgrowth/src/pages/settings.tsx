import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  return (
    <AppLayout>
      <div className="max-w-3xl space-y-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">Settings</h1>
          <p className="text-lg text-muted-foreground mt-2 font-medium">Manage your account and preferences.</p>
        </div>

        <Card className="rounded-3xl border-border/50 shadow-sm overflow-hidden bg-card">
          <CardHeader className="bg-muted/30 border-b border-border/50 pb-6">
            <CardTitle className="text-2xl font-bold">Profile Information</CardTitle>
            <CardDescription className="font-medium text-base">Update your account details.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <Label className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Full Name</Label>
              <Input defaultValue="Alex Developer" className="rounded-xl h-12 text-lg font-medium bg-muted/30 border-transparent focus-visible:bg-background" />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Email Address</Label>
              <Input type="email" defaultValue="alex@indieapp.com" className="rounded-xl h-12 text-lg font-medium bg-muted/30 border-transparent focus-visible:bg-background" />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Company Name</Label>
              <Input defaultValue="Indie Studios" className="rounded-xl h-12 text-lg font-medium bg-muted/30 border-transparent focus-visible:bg-background" />
            </div>
            <Button className="rounded-xl font-bold shadow-sm h-12 px-8 hover-elevate">Save Changes</Button>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/50 shadow-sm overflow-hidden bg-card">
          <CardHeader className="bg-muted/30 border-b border-border/50 pb-6">
            <CardTitle className="text-2xl font-bold">Notifications</CardTitle>
            <CardDescription className="font-medium text-base">Choose what you want to be notified about.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-lg">Daily Summary</h4>
                <p className="text-muted-foreground font-medium text-sm mt-1">Receive a daily digest of downloads and reviews.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="h-px bg-border/50" />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-lg">Negative Reviews</h4>
                <p className="text-muted-foreground font-medium text-sm mt-1">Get alerted immediately when a 1 or 2-star review is posted.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="h-px bg-border/50" />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-lg">Campaign Milestones</h4>
                <p className="text-muted-foreground font-medium text-sm mt-1">Alerts when ads hit spend limits or goal CPI.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
