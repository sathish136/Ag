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
import { Download, Filter, Search, Network, Globe, Shield, Activity, Clock, ArrowUpDown } from "lucide-react";

export default function NetworkPage() {
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

  const { data: networkActivity, isLoading: networkLoading } = useQuery({
    queryKey: ["/api/network"],
    retry: false,
  });

  const { data: activeConnections } = useQuery({
    queryKey: ["/api/network/active"],
    retry: false,
  });

  if (!isAuthenticated || isLoading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  const getProtocolIcon = (protocol: string) => {
    switch (protocol?.toUpperCase()) {
      case 'HTTPS': 
      case 'HTTP': return <Globe className="w-5 h-5 text-green-400" />;
      case 'TCP': return <Network className="w-5 h-5 text-blue-400" />;
      case 'UDP': return <Network className="w-5 h-5 text-purple-400" />;
      case 'WSS':
      case 'WS': return <Activity className="w-5 h-5 text-yellow-400" />;
      default: return <Network className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (state: string) => {
    switch (state?.toLowerCase()) {
      case 'established': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'listening': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'closed': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      case 'blocked': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    }
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return '-';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getDomainFromHost = (host: string) => {
    try {
      // Remove protocol if present
      const cleanHost = host.replace(/^https?:\/\//, '');
      // Split by dots and take last two parts for domain
      const parts = cleanHost.split('.');
      if (parts.length >= 2) {
        return parts.slice(-2).join('.');
      }
      return cleanHost;
    } catch {
      return host;
    }
  };

  const filteredActivity = networkActivity?.filter(activity =>
    activity.destinationHost.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.destinationIp?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.protocol.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const stats = {
    totalConnections: networkActivity?.length || 0,
    activeConnections: activeConnections?.length || 0,
    uniqueHosts: new Set(networkActivity?.map(a => a.destinationHost)).size || 0,
    secureConnections: networkActivity?.filter(a => a.protocol.toUpperCase().includes('HTTPS') || a.protocol.toUpperCase().includes('WSS')).length || 0,
    totalDataTransfer: networkActivity?.reduce((sum, a) => sum + (a.bytesReceived || 0) + (a.bytesSent || 0), 0) || 0,
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="flex">
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            title="Network Monitoring"
            description="Track network connections and data transfer"
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Network className="w-8 h-8 text-blue-400" />
                    <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Total</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">{stats.totalConnections}</div>
                  <p className="text-slate-400 text-sm">Total Connections</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Activity className="w-8 h-8 text-green-400" />
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">{stats.activeConnections}</div>
                  <p className="text-slate-400 text-sm">Active Now</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Globe className="w-8 h-8 text-purple-400" />
                    <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">Hosts</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">{stats.uniqueHosts}</div>
                  <p className="text-slate-400 text-sm">Unique Hosts</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Shield className="w-8 h-8 text-green-400" />
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Secure</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">{stats.secureConnections}</div>
                  <p className="text-slate-400 text-sm">Secure (HTTPS)</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <ArrowUpDown className="w-8 h-8 text-yellow-400" />
                    <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">Data</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">{formatBytes(stats.totalDataTransfer)}</div>
                  <p className="text-slate-400 text-sm">Data Transfer</p>
                </CardContent>
              </Card>
            </div>

            {/* Network Activity Table */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-white">Network Activity</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <Input 
                        placeholder="Search connections..." 
                        className="bg-slate-900 border-slate-600 text-white pl-10 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        data-testid="input-search-network"
                      />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="bg-slate-900 border-slate-600 text-white w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="https">HTTPS</SelectItem>
                        <SelectItem value="tcp">TCP</SelectItem>
                        <SelectItem value="udp">UDP</SelectItem>
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
                        <th className="text-left py-3 text-sm font-medium text-slate-400">Destination</th>
                        <th className="text-right py-3 text-sm font-medium text-slate-400">Protocol</th>
                        <th className="text-right py-3 text-sm font-medium text-slate-400">Data Transfer</th>
                        <th className="text-right py-3 text-sm font-medium text-slate-400">Timestamp</th>
                        <th className="text-right py-3 text-sm font-medium text-slate-400">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {networkLoading ? (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-slate-400">Loading network activity...</td>
                        </tr>
                      ) : filteredActivity.length > 0 ? (
                        filteredActivity.map((activity, index) => (
                          <tr key={activity.id} className="border-b border-slate-600/30 hover:bg-slate-700/50">
                            <td className="py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                                  {getProtocolIcon(activity.protocol)}
                                </div>
                                <div>
                                  <div className="font-medium text-white" data-testid={`text-destination-host-${index}`}>
                                    {getDomainFromHost(activity.destinationHost)}
                                  </div>
                                  <div className="text-xs text-slate-400">
                                    {activity.destinationIp}:{activity.destinationPort}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="text-right py-4">
                              <Badge 
                                variant="outline" 
                                className="border-slate-600 text-slate-300"
                                data-testid={`badge-protocol-${index}`}
                              >
                                {activity.protocol}
                              </Badge>
                            </td>
                            <td className="text-right py-4 text-slate-300 text-sm">
                              <div className="space-y-1">
                                <div className="flex items-center justify-end space-x-1">
                                  <span className="text-green-400">↓</span>
                                  <span>{formatBytes(activity.bytesReceived)}</span>
                                </div>
                                <div className="flex items-center justify-end space-x-1">
                                  <span className="text-blue-400">↑</span>
                                  <span>{formatBytes(activity.bytesSent)}</span>
                                </div>
                              </div>
                            </td>
                            <td className="text-right py-4 text-slate-300 text-sm">
                              <div className="flex items-center justify-end space-x-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>{formatDateTime(activity.timestamp)}</span>
                              </div>
                            </td>
                            <td className="text-right py-4">
                              <Badge 
                                className={getStatusColor(activity.connectionState)}
                                data-testid={`badge-status-${index}`}
                              >
                                {activity.connectionState || 'Unknown'}
                              </Badge>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-slate-400">
                            {searchTerm ? 'No network activity found matching your search' : 'No network activity available'}
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
