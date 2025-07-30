import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Filter, Search, Globe, Clock, BarChart3, Chrome, Folder, TrendingUp } from "lucide-react";

export default function WebUsage() {
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

  const { data: webUsageActivity, isLoading: webLoading } = useQuery({
    queryKey: ["/api/webusage"],
    retry: false,
  });

  if (!isAuthenticated || isLoading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'work': return <Folder className="w-5 h-5 text-blue-400" />;
      case 'social': return <Globe className="w-5 h-5 text-purple-400" />;
      case 'entertainment': return <Globe className="w-5 h-5 text-red-400" />;
      case 'productivity': return <BarChart3 className="w-5 h-5 text-green-400" />;
      case 'shopping': return <Globe className="w-5 h-5 text-yellow-400" />;
      default: return <Globe className="w-5 h-5 text-gray-400" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'work': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'social': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'entertainment': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'productivity': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'shopping': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getBrowserIcon = (browserName: string) => {
    switch (browserName?.toLowerCase()) {
      case 'chrome':
      case 'google chrome': return <Chrome className="w-4 h-4 text-blue-400" />;
      default: return <Globe className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return '-';
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getDomainFromUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url;
    }
  };

  const truncateTitle = (title: string, maxLength = 50) => {
    if (!title || title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  const filteredActivity = webUsageActivity?.filter(activity =>
    activity.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.category?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const stats = {
    totalVisits: webUsageActivity?.length || 0,
    totalTime: webUsageActivity?.reduce((sum, activity) => sum + (activity.visitDuration || 0), 0) || 0,
    uniqueDomains: new Set(webUsageActivity?.map(a => a.domain)).size || 0,
    categories: new Set(webUsageActivity?.map(a => a.category).filter(Boolean)).size || 0,
  };

  // Calculate top domains
  const domainStats = webUsageActivity?.reduce((acc, activity) => {
    const domain = activity.domain;
    if (!acc[domain]) {
      acc[domain] = { visits: 0, duration: 0 };
    }
    acc[domain].visits++;
    acc[domain].duration += activity.visitDuration || 0;
    return acc;
  }, {} as Record<string, { visits: number; duration: number }>) || {};

  const topDomains = Object.entries(domainStats)
    .sort((a, b) => b[1].duration - a[1].duration)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="flex">
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            title="Web Usage Monitoring"
            description="Track website visits and browsing patterns"
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Globe className="w-8 h-8 text-blue-400" />
                    <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Visits</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">{stats.totalVisits}</div>
                  <p className="text-slate-400 text-sm">Total Visits</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Clock className="w-8 h-8 text-green-400" />
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Time</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    {formatDuration(stats.totalTime)}
                  </div>
                  <p className="text-slate-400 text-sm">Total Time</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <BarChart3 className="w-8 h-8 text-purple-400" />
                    <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">Sites</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">{stats.uniqueDomains}</div>
                  <p className="text-slate-400 text-sm">Unique Domains</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Folder className="w-8 h-8 text-yellow-400" />
                    <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">Categories</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">{stats.categories}</div>
                  <p className="text-slate-400 text-sm">Categories</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Web Activity Table */}
              <div className="xl:col-span-2">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-white">Web Activity</CardTitle>
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                          <Input 
                            placeholder="Search websites..." 
                            className="bg-slate-900 border-slate-600 text-white pl-10 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            data-testid="input-search-web-usage"
                          />
                        </div>
                        <Select defaultValue="all">
                          <SelectTrigger className="bg-slate-900 border-slate-600 text-white w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="work">Work</SelectItem>
                            <SelectItem value="social">Social</SelectItem>
                            <SelectItem value="entertainment">Entertainment</SelectItem>
                          </SelectContent>
                        </Select>
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
                            <th className="text-left py-3 text-sm font-medium text-slate-400">Website</th>
                            <th className="text-right py-3 text-sm font-medium text-slate-400">Duration</th>
                            <th className="text-right py-3 text-sm font-medium text-slate-400">Category</th>
                            <th className="text-right py-3 text-sm font-medium text-slate-400">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody>
                          {webLoading ? (
                            <tr>
                              <td colSpan={4} className="text-center py-8 text-slate-400">Loading web usage...</td>
                            </tr>
                          ) : filteredActivity.length > 0 ? (
                            filteredActivity.map((activity, index) => (
                              <tr key={activity.id} className="border-b border-slate-600/30 hover:bg-slate-700/50">
                                <td className="py-4">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                                      {getBrowserIcon(activity.browserName)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="font-medium text-white truncate" data-testid={`text-website-title-${index}`}>
                                        {activity.title ? truncateTitle(activity.title) : getDomainFromUrl(activity.url)}
                                      </div>
                                      <div className="text-xs text-slate-400 truncate">
                                        {getDomainFromUrl(activity.url)}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="text-right py-4 text-slate-300">
                                  <div className="flex items-center justify-end space-x-1">
                                    <Clock className="w-3 h-3 text-slate-400" />
                                    <span>{formatDuration(activity.visitDuration)}</span>
                                  </div>
                                </td>
                                <td className="text-right py-4">
                                  {activity.category ? (
                                    <Badge className={getCategoryColor(activity.category)}>
                                      {activity.category}
                                    </Badge>
                                  ) : (
                                    <span className="text-slate-400 text-sm">-</span>
                                  )}
                                </td>
                                <td className="text-right py-4 text-slate-300 text-sm">
                                  {formatDateTime(activity.timestamp)}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="text-center py-8 text-slate-400">
                                {searchTerm ? 'No web usage found matching your search' : 'No web usage data available'}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Websites Sidebar */}
              <div>
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-white">Top Websites</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topDomains.length > 0 ? (
                        topDomains.map(([domain, stats], index) => (
                          <div key={domain} className="flex items-center space-x-3 p-3 bg-slate-900 rounded-lg">
                            <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Globe className="w-4 h-4 text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-white truncate">
                                {domain}
                              </div>
                              <div className="text-xs text-slate-400">
                                {formatDuration(stats.duration)} • {stats.visits} visits
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <TrendingUp className="w-4 h-4 text-green-400" />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-slate-400">
                          No website data available
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
