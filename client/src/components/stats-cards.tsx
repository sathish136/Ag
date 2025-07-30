import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, Keyboard, Network, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardsProps {
  stats?: {
    activeApps?: number;
    keystrokes?: number;
    networkConnections?: number;
    activeSessions?: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const statsData = [
    {
      icon: Monitor,
      title: "Active Applications",
      value: stats?.activeApps || 0,
      change: "+12%",
      trend: "up",
      color: "blue",
    },
    {
      icon: Keyboard,
      title: "Keystrokes Today",
      value: stats?.keystrokes || 0,
      change: "+8%",
      trend: "up",
      color: "yellow",
    },
    {
      icon: Network,
      title: "Network Connections",
      value: stats?.networkConnections || 0,
      change: "+5%",
      trend: "up",
      color: "green",
    },
    {
      icon: AlertTriangle,
      title: "Security Alerts",
      value: 3, // Static value as in design
      change: "Alert",
      trend: "alert",
      color: "red",
    },
  ];

  const getIconColor = (color: string) => {
    switch (color) {
      case "blue": return "text-blue-400";
      case "yellow": return "text-yellow-400";
      case "green": return "text-green-400";
      case "red": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  const getBgColor = (color: string) => {
    switch (color) {
      case "blue": return "bg-blue-500/10";
      case "yellow": return "bg-yellow-500/10";
      case "green": return "bg-green-500/10";
      case "red": return "bg-red-500/10";
      default: return "bg-gray-500/10";
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-green-400";
      case "down": return "text-red-400";
      case "alert": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="w-3 h-3" />;
      case "down": return <TrendingDown className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${getBgColor(stat.color)} rounded-lg flex items-center justify-center`}>
                  <Icon className={`${getIconColor(stat.color)} text-xl w-6 h-6`} />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${getTrendColor(stat.trend)}`}>
                  {getTrendIcon(stat.trend)}
                  <span data-testid={`badge-trend-${index}`}>{stat.change}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1" data-testid={`text-stat-value-${index}`}>
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              </h3>
              <p className="text-slate-400 text-sm" data-testid={`text-stat-title-${index}`}>{stat.title}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
