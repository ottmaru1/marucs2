import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import OttPlus from "@/pages/services/ott-plus";
import StreamPlayer from "@/pages/services/streamplayer";
import NetflixAccount from "@/pages/services/netflix-account";
import NoHardSystem from "@/pages/services/nohard-system";
import SuccessStories from "@/pages/success-stories";
import Downloads from "@/pages/downloads";
import Contact from "@/pages/contact";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Admin from "@/pages/admin";
import AdminPricing from "@/pages/admin-pricing";
import { AdminAuthProvider } from "@/components/admin/admin-auth-provider";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/services/ott-plus" component={OttPlus} />
      <Route path="/services/streamplayer" component={StreamPlayer} />
      <Route path="/services/netflix-account" component={NetflixAccount} />
      <Route path="/services/nohard-system" component={NoHardSystem} />
      <Route path="/success-stories" component={SuccessStories} />
      <Route path="/downloads" component={Downloads} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/pricing" component={AdminPricing} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
