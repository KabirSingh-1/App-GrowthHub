import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import AppsList from "@/pages/apps/index";
import AppDetail from "@/pages/apps/detail";
import Ratings from "@/pages/ratings";
import Aso from "@/pages/aso";
import Notifications from "@/pages/notifications";
import Settings from "@/pages/settings";
import OrderRatings from "@/pages/order/ratings";
import OrderAsoInstalls from "@/pages/order/aso-installs";
import OrderVideos from "@/pages/order/videos";
import Orders from "@/pages/orders";
import Marketing from "@/pages/marketing";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/apps" component={AppsList} />
      <Route path="/apps/:id" component={AppDetail} />
      <Route path="/ratings" component={Ratings} />
      <Route path="/aso" component={Aso} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/settings" component={Settings} />
      <Route path="/order/ratings" component={OrderRatings} />
      <Route path="/order/aso-installs" component={OrderAsoInstalls} />
      <Route path="/order/videos" component={OrderVideos} />
      <Route path="/orders" component={Orders} />
      <Route path="/marketing" component={Marketing} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
