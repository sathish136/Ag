import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Monitor, FolderOpen, Network, AlertTriangle, Clock } from "lucide-react";

interface RealtimeActivityProps {
  activity?: Array<{
    type: string;
    title: string;
    description: string;
    timestamp: string;
    status: string;
  }>;
  isConnected?: boolean;
}

export default function RealtimeActivity({ activity = [], isConnected = false }: RealtimeActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'application': return <Monitor className="w-4 h-4 text-blue-400" />;
      case 'file': return <FolderOpen className="w-4 h-4 text-yellow-400" />;
      case 'network': return <Network className="w-4 h-4 text-green-400" />;
      case 'security': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <Monitor className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-400';
      case 'warning': return 'bg-yellow-400';
      case 'error': return 'bg-red-400';
      case 'info': return 'bg-blue-400';
      default: return 'bg-gray-400';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CardTitle className="text-lg font-semibold text-white">Real-time Activity</CardTitle>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className="text-xs text-slate-400">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="bg-slate-900 border-slate-600 text-white w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              <SelectItem value="applications">Applications</SelectItem>
              <SelectItem value="network">Network</SelectItem>
              <SelectItem value="files">File Access</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activity.length > 0 ? (
            activity.map((event, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-slate-900 rounded-lg border border-slate-700/50">
                <div className={`w-2 h-2 ${getStatusColor(event.status)} rounded-full mt-2 flex-shrink-0`}></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getActivityIcon(event.type)}
                      <span className="font-medium text-white" data-testid={`text-activity-title-${index}`}>
                        {event.title}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-slate-400 text-sm">
                      <Clock className="w-3 h-3" />
                      <span data-testid={`text-activity-time-${index}`}>
                        {formatTimeAgo(event.timestamp)}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm" data-testid={`text-activity-description-${index}`}>
                    {event.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Monitor className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No recent activity</p>
              <p className="text-slate-500 text-sm">Activity will appear here as it happens</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
