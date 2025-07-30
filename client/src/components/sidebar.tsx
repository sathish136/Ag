import { Link, useLocation } from "wouter";
import { Shield, BarChart3, Monitor, Clipboard, MessageCircle, FolderOpen, Keyboard, Network, Globe, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Applications", href: "/applications", icon: Monitor },
  { name: "Clipboard", href: "/clipboard", icon: Clipboard },
  { name: "Communication", href: "/communication", icon: MessageCircle },
  { name: "File Access", href: "/file-access", icon: FolderOpen },
  { name: "Keystrokes", href: "/keystrokes", icon: Keyboard },
  { name: "Network", href: "/network", icon: Network },
  { name: "Web Usage", href: "/web-usage", icon: Globe },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <div className="w-64 bg-slate-800 border-r border-slate-700 flex-shrink-0 flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">SecureMonitor</h1>
        </div>
        
        {/* Navigation */}
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href}>
                <a
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      : "text-slate-400 hover:bg-slate-700 hover:text-white"
                  )}
                  data-testid={`link-${item.name.toLowerCase().replace(' ', '-')}`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.name}</span>
                </a>
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* User section at bottom */}
      <div className="mt-auto p-6 border-t border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
            {user?.profileImageUrl ? (
              <img 
                src={user.profileImageUrl} 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <User className="w-4 h-4 text-slate-300" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}`
                : user?.email || "Admin User"
              }
            </p>
            <p className="text-xs text-slate-400">Administrator</p>
          </div>
          <button 
            className="text-slate-400 hover:text-white transition-colors"
            onClick={() => window.location.href = '/api/logout'}
            data-testid="button-logout"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
