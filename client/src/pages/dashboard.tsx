import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import StatsCards from "@/components/stats-cards";
import RealtimeActivity from "@/components/realtime-activity";
import ActiveSessions from "@/components/active-sessions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Download, Filter, Search, Chrome, FileText, Code, Table } from "lucide-react";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const { stats, activity, isConnected } = useWebSocket();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: topApps, isLoading: appsLoading } = useQuery({
    queryKey: ["/api/appusage/top"],
    retry: false,
  });

  const { data: networkConnections, isLoading: networkLoading } = useQuery({
    queryKey: ["/api/network/active"],
    retry: false,
  });

  if (!isAuthenticated || isLoading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  const getApplicationIcon = (appName: string) => {
    const name = appName.toLowerCase();
    if (name.includes('chrome')) return <Chrome className="w-4 h-4 text-blue-400" />;
    if (name.includes('word')) return <FileText className="w-4 h-4 text-blue-600" />;
    if (name.includes('excel')) return <Table className="w-4 h-4 text-green-500" />;
    if (name.includes('code') || name.includes('visual studio')) return <Code className="w-4 h-4 text-purple-500" />;
    return <FileText className="w-4 h-4 text-gray-400" />;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="flex">
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          
          <main className="flex-1 overflow-y-auto p-6">
            <StatsCards stats={stats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <RealtimeActivity activity={activity} isConnected={isConnected} />
              </div>
              <div>
                <ActiveSessions />
              </div>
            </div>

            {/* Data Tables */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Top Applications */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-white">Top Applications</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Input 
                        placeholder="Search..." 
                        className="bg-slate-900 border-slate-600 text-white w-32"
                        data-testid="input-search-apps"
                      />
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <Filter className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left py-3 text-sm font-medium text-slate-400">Application</th>
                          <th className="text-right py-3 text-sm font-medium text-slate-400">Usage</th>
                          <th className="text-right py-3 text-sm font-medium text-slate-400">Sessions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appsLoading ? (
                          <tr>
                            <td colSpan={3} className="text-center py-8 text-slate-400">Loading applications...</td>
                          </tr>
                        ) : topApps && topApps.length > 0 ? (
                          topApps.map((app, index) => (
                            <tr key={index} className="border-b border-slate-600/30 hover:bg-slate-700/50">
                              <td className="py-3">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                                    {getApplicationIcon(app.applicationName)}
                                  </div>
                                  <span className="font-medium text-white" data-testid={`text-app-name-${index}`}>
                                    {app.applicationName}
                                  </span>
                                </div>
                              </td>
                              <td className="text-right py-3 text-slate-300" data-testid={`text-app-duration-${index}`}>
                                {formatDuration(app.totalDuration)}
                              </td>
                              <td className="text-right py-3 text-slate-300" data-testid={`text-app-sessions-${index}`}>
                                {app.sessionCount}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="text-center py-8 text-slate-400">No application data available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Network Activity */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-white">Recent Network Activity</CardTitle>
                    <Select defaultValue="1h">
                      <SelectTrigger className="bg-slate-900 border-slate-600 text-white w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">Last Hour</SelectItem>
                        <SelectItem value="24h">Last 24 Hours</SelectItem>
                        <SelectItem value="7d">Last Week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left py-3 text-sm font-medium text-slate-400">Destination</th>
                          <th className="text-right py-3 text-sm font-medium text-slate-400">Protocol</th>
                          <th className="text-right py-3 text-sm font-medium text-slate-400">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {networkLoading ? (
                          <tr>
                            <td colSpan={3} className="text-center py-8 text-slate-400">Loading network activity...</td>
                          </tr>
                        ) : networkConnections && networkConnections.length > 0 ? (
                          networkConnections.map((conn, index) => (
                            <tr key={index} className="border-b border-slate-600/30 hover:bg-slate-700/50">
                              <td className="py-3">
                                <div>
                                  <div className="font-medium text-sm text-white" data-testid={`text-network-host-${index}`}>
                                    {conn.destinationHost}
                                  </div>
                                  <div className="text-slate-400 text-xs" data-testid={`text-network-ip-${index}`}>
                                    {conn.destinationIp}:{conn.destinationPort}
                                  </div>
                                </div>
                              </td>
                              <td className="text-right py-3 text-slate-300 text-sm" data-testid={`text-network-protocol-${index}`}>
                                {conn.protocol}
                              </td>
                              <td className="text-right py-3">
                                <Badge 
                                  variant={conn.connectionState === 'established' ? 'default' : 'secondary'}
                                  className={
                                    conn.connectionState === 'established' 
                                      ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                      : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                  }
                                  data-testid={`badge-network-status-${index}`}
                                >
                                  {conn.connectionState}
                                </Badge>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="text-center py-8 text-slate-400">No network activity available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
