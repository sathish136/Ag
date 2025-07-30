import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";

interface HeaderProps {
  title?: string;
  description?: string;
  showExport?: boolean;
}

export default function Header({ 
  title = "Monitoring Dashboard", 
  description = "Real-time agent monitoring and analytics",
  showExport = true 
}: HeaderProps) {
  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export functionality to be implemented");
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-slate-400">{description}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-slate-900 px-3 py-2 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-white">Live</span>
          </div>
          {showExport && (
            <Button 
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={handleExport}
              data-testid="button-export-header"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
