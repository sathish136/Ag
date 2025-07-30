import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, Filter, Search, Chrome, FileText, Code, Table, Clock, Activity } from "lucide-react";

export default function Applications() {
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

  const { data: applications, isLoading: appsLoading } = useQuery({
    queryKey: ["/api/appusage"],
    retry: false,
  });

  const { data: topApps } = useQuery({
    queryKey: ["/api/appusage/top"],
    retry: false,
  });

  if (!isAuthenticated || isLoading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  const getApplicationIcon = (appName: string) => {
    const name = appName.toLowerCase();
    if (name.includes('chrome')) return <Chrome className="w-5 h-5 text-blue-400" />;
    if (name.includes('word')) return <FileText className="w-5 h-5 text-blue-600" />;
    if (name.includes('excel')) return <Table className="w-5 h-5 text-green-500" />;
    if (name.includes('code') || name.includes('visual studio')) return <Code className="w-5 h-5 text-purple-500" />;
    return <Activity className="w-5 h-5 text-gray-400" />;
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return "0m";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const filteredApplications = applications?.filter(app =>
    app.applicationName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="flex">
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          
          <main className="flex-1 overflow-y-auto p-6">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white">Application Monitoring</h2>
                <p className="text-slate-400">Track application usage and performance metrics</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button className="bg-blue-500 hover:bg-blue-600" data-testid="button-export">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Activity className="w-8 h-8 text-blue-400" />
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    {applications?.length || 0}
                  </div>
                  <p className="text-slate-400 text-sm">Total Sessions</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Clock className="w-8 h-8 text-yellow-400" />
                    <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Usage</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    {topApps?.reduce((total, app) => total + app.totalDuration, 0) 
                      ? formatDuration(topApps.reduce((total, app) => total + app.totalDuration, 0))
                      : "0m"}
                  </div>
                  <p className="text-slate-400 text-sm">Total Usage Time</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <FileText className="w-8 h-8 text-purple-400" />
                    <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">Apps</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    {new Set(applications?.map(app => app.applicationName)).size || 0}
                  </div>
                  <p className="text-slate-400 text-sm">Unique Applications</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Application Usage List */}
              <div className="xl:col-span-2">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-white">Application Sessions</CardTitle>
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                          <Input 
                            placeholder="Search applications..." 
                            className="bg-slate-900 border-slate-600 text-white pl-10 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            data-testid="input-search-applications"
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
                            <th className="text-right py-3 text-sm font-medium text-slate-400">Duration</th>
                            <th className="text-right py-3 text-sm font-medium text-slate-400">Start Time</th>
                            <th className="text-right py-3 text-sm font-medium text-slate-400">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {appsLoading ? (
                            <tr>
                              <td colSpan={4} className="text-center py-8 text-slate-400">Loading applications...</td>
                            </tr>
                          ) : filteredApplications.length > 0 ? (
                            filteredApplications.map((app, index) => (
                              <tr key={app.id} className="border-b border-slate-600/30 hover:bg-slate-700/50">
                                <td className="py-3">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                                      {getApplicationIcon(app.applicationName)}
                                    </div>
                                    <div>
                                      <div className="font-medium text-white" data-testid={`text-app-name-${index}`}>
                                        {app.applicationName}
                                      </div>
                                      {app.windowTitle && (
                                        <div className="text-xs text-slate-400 truncate max-w-xs">
                                          {app.windowTitle}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="text-right py-3 text-slate-300">
                                  {app.duration ? formatDuration(app.duration) : "Active"}
                                </td>
                                <td className="text-right py-3 text-slate-300 text-sm">
                                  {formatDateTime(app.startTime)}
                                </td>
                                <td className="text-right py-3">
                                  <Badge 
                                    variant={app.endTime ? 'secondary' : 'default'}
                                    className={
                                      app.endTime 
                                        ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' 
                                        : 'bg-green-500/10 text-green-400 border-green-500/20'
                                    }
                                  >
                                    {app.endTime ? 'Closed' : 'Active'}
                                  </Badge>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="text-center py-8 text-slate-400">
                                {searchTerm ? 'No applications found matching your search' : 'No application data available'}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Applications Sidebar */}
              <div>
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-white">Most Used Applications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topApps && topApps.length > 0 ? (
                        topApps.slice(0, 5).map((app, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-slate-900 rounded-lg">
                            <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                              {getApplicationIcon(app.applicationName)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-white truncate">
                                {app.applicationName}
                              </div>
                              <div className="text-xs text-slate-400">
                                {formatDuration(app.totalDuration)} • {app.sessionCount} sessions
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-slate-400">
                          No usage data available
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
