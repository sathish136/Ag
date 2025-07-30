import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, Filter, Search, Mail, MessageCircle, Phone, Clock, User, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export default function Communication() {
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

  const { data: communicationActivity, isLoading: commLoading } = useQuery({
    queryKey: ["/api/communication"],
    retry: false,
  });

  if (!isAuthenticated || isLoading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'email': return <Mail className="w-5 h-5 text-blue-400" />;
      case 'message': return <MessageCircle className="w-5 h-5 text-green-400" />;
      case 'call': return <Phone className="w-5 h-5 text-purple-400" />;
      default: return <MessageCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getDirectionIcon = (direction: string) => {
    return direction === 'outgoing' 
      ? <ArrowUpRight className="w-4 h-4 text-blue-400" />
      : <ArrowDownLeft className="w-4 h-4 text-green-400" />;
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return '-';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const filteredActivity = communicationActivity?.filter(activity =>
    activity.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.application?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const stats = {
    totalEvents: communicationActivity?.length || 0,
    emailEvents: communicationActivity?.filter(a => a.type === 'email').length || 0,
    messageEvents: communicationActivity?.filter(a => a.type === 'message').length || 0,
    callEvents: communicationActivity?.filter(a => a.type === 'call').length || 0,
    outgoing: communicationActivity?.filter(a => a.direction === 'outgoing').length || 0,
    incoming: communicationActivity?.filter(a => a.direction === 'incoming').length || 0,
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="flex">
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          
          <main className="flex-1 overflow-y-auto p-6">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white">Communication Monitoring</h2>
                <p className="text-slate-400">Track emails, messages, and calls across applications</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button className="bg-blue-500 hover:bg-blue-600" data-testid="button-export">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-2">
                  <MessageCircle className="w-6 h-6 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-white mb-1">{stats.totalEvents}</div>
                  <p className="text-slate-400 text-xs">Total</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-2">
                  <Mail className="w-6 h-6 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-white mb-1">{stats.emailEvents}</div>
                  <p className="text-slate-400 text-xs">Emails</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-2">
                  <MessageCircle className="w-6 h-6 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-white mb-1">{stats.messageEvents}</div>
                  <p className="text-slate-400 text-xs">Messages</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-2">
                  <Phone className="w-6 h-6 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-white mb-1">{stats.callEvents}</div>
                  <p className="text-slate-400 text-xs">Calls</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-2">
                  <ArrowUpRight className="w-6 h-6 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-white mb-1">{stats.outgoing}</div>
                  <p className="text-slate-400 text-xs">Outgoing</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-2">
                  <ArrowDownLeft className="w-6 h-6 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-white mb-1">{stats.incoming}</div>
                  <p className="text-slate-400 text-xs">Incoming</p>
                </CardContent>
              </Card>
            </div>

            {/* Communication Activity Table */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-white">Communication Activity</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <Input 
                        placeholder="Search communications..." 
                        className="bg-slate-900 border-slate-600 text-white pl-10 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        data-testid="input-search-communication"
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
                        <th className="text-left py-3 text-sm font-medium text-slate-400">Type</th>
                        <th className="text-left py-3 text-sm font-medium text-slate-400">Contact</th>
                        <th className="text-left py-3 text-sm font-medium text-slate-400">Subject/Details</th>
                        <th className="text-right py-3 text-sm font-medium text-slate-400">Duration</th>
                        <th className="text-right py-3 text-sm font-medium text-slate-400">Timestamp</th>
                        <th className="text-right py-3 text-sm font-medium text-slate-400">Application</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commLoading ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-slate-400">Loading communication activity...</td>
                        </tr>
                      ) : filteredActivity.length > 0 ? (
                        filteredActivity.map((activity, index) => (
                          <tr key={activity.id} className="border-b border-slate-600/30 hover:bg-slate-700/50">
                            <td className="py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                                  {getTypeIcon(activity.type)}
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium text-white capitalize" data-testid={`text-comm-type-${index}`}>
                                      {activity.type}
                                    </span>
                                    {getDirectionIcon(activity.direction)}
                                  </div>
                                  <div className="text-xs text-slate-400 capitalize">
                                    {activity.direction}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4">
                              <div className="flex items-center space-x-2">
                                <User className="w-4 h-4 text-slate-400" />
                                <span className="text-white" data-testid={`text-comm-contact-${index}`}>
                                  {activity.contact || 'Unknown'}
                                </span>
                              </div>
                            </td>
                            <td className="py-4">
                              <div className="max-w-md">
                                {activity.subject ? (
                                  <div className="text-white font-medium truncate" data-testid={`text-comm-subject-${index}`}>
                                    {activity.subject}
                                  </div>
                                ) : (
                                  <span className="text-slate-400 text-sm">No subject</span>
                                )}
                              </div>
                            </td>
                            <td className="text-right py-4 text-slate-300">
                              {activity.type === 'call' ? (
                                <div className="flex items-center justify-end space-x-1">
                                  <Clock className="w-4 h-4 text-slate-400" />
                                  <span>{formatDuration(activity.duration)}</span>
                                </div>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </td>
                            <td className="text-right py-4 text-slate-300 text-sm">
                              {formatDateTime(activity.timestamp)}
                            </td>
                            <td className="text-right py-4">
                              {activity.application ? (
                                <Badge variant="outline" className="border-slate-600 text-slate-300">
                                  {activity.application}
                                </Badge>
                              ) : (
                                <span className="text-slate-400 text-sm">-</span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-slate-400">
                            {searchTerm ? 'No communication activity found matching your search' : 'No communication activity available'}
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
