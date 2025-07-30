import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Applications from "@/pages/applications";
import ClipboardPage from "@/pages/clipboard";
import Communication from "@/pages/communication";
import FileAccess from "@/pages/file-access";
import Keystrokes from "@/pages/keystrokes";
import Network from "@/pages/network";
import WebUsage from "@/pages/web-usage";
import Sidebar from "@/components/sidebar";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Public monitoring dashboard - no auth required */}
      <Route path="/monitor" component={() => (
        <div className="flex h-screen bg-slate-900">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Dashboard />
          </div>
        </div>
      )} />
      
      {/* Authenticated admin sections */}
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <div className="flex h-screen bg-slate-900">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Route path="/" component={Dashboard} />
            <Route path="/applications" component={Applications} />
            <Route path="/clipboard" component={ClipboardPage} />
            <Route path="/communication" component={Communication} />
            <Route path="/file-access" component={FileAccess} />
            <Route path="/keystrokes" component={Keystrokes} />
            <Route path="/network" component={Network} />
            <Route path="/web-usage" component={WebUsage} />
          </div>
        </div>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
