import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Monitor, Clock, User } from "lucide-react";

export default function ActiveSessions() {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ["/api/sessions"],
    retry: false,
  });

  const formatDuration = (startTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const diffInMinutes = Math.floor((now.getTime() - start.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-400';
      case 'inactive': return 'bg-yellow-400';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string, lastActivity?: string) => {
    if (status === 'offline') return 'Offline';
    if (status === 'inactive') return 'Inactive';
    if (lastActivity) {
      const diffInMinutes = Math.floor((new Date().getTime() - new Date(lastActivity).getTime()) / (1000 * 60));
      if (diffInMinutes < 1) return 'Active';
      return `${diffInMinutes}m ago`;
    }
    return 'Active';
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">Active Monitoring Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-4 text-slate-400">Loading sessions...</div>
          ) : sessions && sessions.length > 0 ? (
            sessions.slice(0, 4).map((session, index) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 ${getStatusColor(session.status)} rounded-full`}></div>
                  <div className="flex items-center space-x-2">
                    <Monitor className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="font-medium text-sm text-white" data-testid={`text-session-device-${index}`}>
                        {session.deviceName}
                      </p>
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3 text-slate-500" />
                        <p className="text-slate-400 text-xs" data-testid={`text-session-user-${index}`}>
                          {session.userName || 'Unknown User'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span data-testid={`text-session-duration-${index}`}>
                      {session.status === 'offline' 
                        ? getStatusText(session.status)
                        : formatDuration(session.startTime)
                      }
                    </span>
                  </div>
                  {session.status !== 'offline' && (
                    <div className="text-xs text-slate-500 mt-1">
                      {getStatusText(session.status, session.lastActivity)}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Monitor className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No active sessions</p>
              <p className="text-slate-500 text-sm">Monitoring sessions will appear here</p>
            </div>
          )}
          
          {sessions && sessions.length > 4 && (
            <Button 
              variant="ghost" 
              className="w-full text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
              data-testid="button-view-all-sessions"
            >
              View All Sessions
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
