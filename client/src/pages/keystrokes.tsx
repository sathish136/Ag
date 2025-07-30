import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, Filter, Search, Keyboard, Clock, Monitor, AlertTriangle } from "lucide-react";

export default function Keystrokes() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

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

  const { data: keystrokeActivity, isLoading: keystrokeLoading } = useQuery({
    queryKey: ["/api/keystrokes"],
    retry: false,
  });

  if (!isAuthenticated || isLoading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const formatTimeWindow = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  };

  const getRiskLevel = (keystrokeCount: number) => {
    if (keystrokeCount > 1000) return { level: 'high', color: 'bg-red-500/10 text-red-400 border-red-500/20' };
    if (keystrokeCount > 500) return { level: 'medium', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' };
    return { level: 'low', color: 'bg-green-500/10 text-green-400 border-green-500/20' };
  };

  const filteredActivity = keystrokeActivity?.filter(activity =>
    activity.applicationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.windowTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const stats = {
    totalKeystrokes: keystrokeActivity?.reduce((sum, activity) => sum + activity.keystrokeCount, 0) || 0,
    totalSessions: keystrokeActivity?.length || 0,
    uniqueApps: new Set(keystrokeActivity?.map(a => a.applicationName).filter(Boolean)).size || 0,
    highActivitySessions: keystrokeActivity?.filter(a => a.keystrokeCount > 500).length || 0,
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="flex">
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            title="Keystroke Monitoring"
            description="Track keystroke patterns and typing activity"
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Keyboard className="w-8 h-8 text-blue-400" />
                    <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Total</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    {stats.totalKeystrokes.toLocaleString()}
                  </div>
                  <p className="text-slate-400 text-sm">Total Keystrokes</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Clock className="w-8 h-8 text-green-400" />
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Sessions</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">{stats.totalSessions}</div>
                  <p className="text-slate-400 text-sm">Recording Sessions</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Monitor className="w-8 h-8 text-purple-400" />
                    <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">Apps</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">{stats.uniqueApps}</div>
                  <p className="text-slate-400 text-sm">Applications</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <AlertTriangle className="w-8 h-8 text-yellow-400" />
                    <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">High</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">{stats.highActivitySessions}</div>
                  <p className="text-slate-400 text-sm">High Activity</p>
                </CardContent>
              </Card>
            </div>

            {/* Keystroke Activity Table */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-white">Keystroke Activity</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <Input 
                        placeholder="Search applications..." 
                        className="bg-slate-900 border-slate-600 text-white pl-10 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        data-testid="input-search-keystrokes"
                      />
                    </div>
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
                        <th className="text-right py-3 text-sm font-medium text-slate-400">Keystrokes</th>
                        <th className="text-right py-3 text-sm font-medium text-slate-400">Time Window</th>
                        <th className="text-right py-3 text-sm font-medium text-slate-400">Timestamp</th>
                        <th className="text-right py-3 text-sm font-medium text-slate-400">Risk Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {keystrokeLoading ? (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-slate-400">Loading keystroke activity...</td>
                        </tr>
                      ) : filteredActivity.length > 0 ? (
                        filteredActivity.map((activity, index) => {
                          const risk = getRiskLevel(activity.keystrokeCount);
                          return (
                            <tr key={activity.id} className="border-b border-slate-600/30 hover:bg-slate-700/50">
                              <td className="py-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                                    <Keyboard className="w-5 h-5 text-blue-400" />
                                  </div>
                                  <div>
                                    <div className="font-medium text-white" data-testid={`text-app-name-${index}`}>
                                      {activity.applicationName || 'Unknown Application'}
                                    </div>
                                    {activity.windowTitle && (
                                      <div className="text-xs text-slate-400 truncate max-w-xs">
                                        {activity.windowTitle}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="text-right py-4">
                                <div className="text-white font-medium" data-testid={`text-keystroke-count-${index}`}>
                                  {activity.keystrokeCount.toLocaleString()}
                                </div>
                              </td>
                              <td className="text-right py-4 text-slate-300 text-sm">
                                <div className="flex items-center justify-end space-x-1">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <span>{formatTimeWindow(activity.timeWindow)}</span>
                                </div>
                              </td>
                              <td className="text-right py-4 text-slate-300 text-sm">
                                {formatDateTime(activity.timestamp)}
                              </td>
                              <td className="text-right py-4">
                                <Badge className={risk.color}>
                                  {risk.level.toUpperCase()}
                                </Badge>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-slate-400">
                            {searchTerm ? 'No keystroke activity found matching your search' : 'No keystroke activity available'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
