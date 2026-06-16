import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md z-50 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
              AG
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">AppGrowth</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="rounded-xl font-medium">Log in</Button>
            </Link>
            <Link href="/dashboard">
              <Button className="rounded-xl font-bold px-6 shadow-sm hover-elevate">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none text-foreground">
            The co-pilot every app developer <span className="text-primary">wishes</span> they had.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium">
            From your first 100 downloads to your first million. Ratings, ASO, Meta ads, and user acquisition—all in one place.
          </p>
          <div className="pt-8">
            <Link href="/dashboard">
              <Button size="lg" className="h-16 px-10 text-xl rounded-2xl font-bold shadow-lg hover-elevate">
                Launch Mission Control
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
