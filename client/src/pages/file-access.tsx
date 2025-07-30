import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, Filter, Search, File, Folder, HardDrive, AlertTriangle, Plus, Edit, Trash, FileX } from "lucide-react";

export default function FileAccess() {
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

  const { data: fileActivity, isLoading: fileLoading } = useQuery({
    queryKey: ["/api/fileaccess"],
    retry: false,
  });

  if (!isAuthenticated || isLoading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  const getOperationIcon = (operation: string) => {
    switch (operation?.toLowerCase()) {
      case 'created': return <Plus className="w-5 h-5 text-green-400" />;
      case 'modified': return <Edit className="w-5 h-5 text-blue-400" />;
      case 'deleted': return <Trash className="w-5 h-5 text-red-400" />;
      case 'renamed': return <FileX className="w-5 h-5 text-yellow-400" />;
      case 'accessed': return <File className="w-5 h-5 text-purple-400" />;
      default: return <File className="w-5 h-5 text-gray-400" />;
    }
  };

  const getOperationColor = (operation: string) => {
    switch (operation?.toLowerCase()) {
      case 'created': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'modified': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'deleted': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'renamed': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'accessed': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '-';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (!extension) return <File className="w-4 h-4 text-gray-400" />;
    
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension)) {
      return <File className="w-4 h-4 text-green-400" />;
    }
    if (['pdf'].includes(extension)) {
      return <File className="w-4 h-4 text-red-400" />;
    }
    if (['doc', 'docx', 'txt', 'rtf'].includes(extension)) {
      return <File className="w-4 h-4 text-blue-400" />;
    }
    if (['xls', 'xlsx', 'csv'].includes(extension)) {
      return <File className="w-4 h-4 text-green-600" />;
    }
    return <File className="w-4 h-4 text-gray-400" />;
  };

  const filteredActivity = fileActivity?.filter(activity =>
    activity.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.filePath.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.operation.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const stats = {
    totalEvents: fileActivity?.length || 0,
    created: fileActivity?.filter(a => a.operation === 'created').length || 0,
    modified: fileActivity?.filter(a => a.operation === 'modified').length || 0,
    deleted: fileActivity?.filter(a => a.operation === 'deleted').length || 0,
    usbEvents: fileActivity?.filter(a => a.isUsbDrive).length || 0,
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
                <h2 className="text-2xl font-bold text-white">File Access Monitoring</h2>
                <p className="text-slate-400">Track file operations and USB device activity</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button className="bg-blue-500 hover:bg-blue-600" data-testid="button-export">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <File className="w-8 h-8 text-blue-400" />
                    <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Total</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">{stats.totalEvents}</div>
                  <p className="text-slate-400 text-sm">Total Events</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Plus className="w-8 h-8 text-green-400" />
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Created</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">{stats.created}</div>
                  <p className="text-slate-400 text-sm">Files Created</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Edit className="w-8 h-8 text-blue-400" />
                    <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Modified</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">{stats.modified}</div>
                  <p className="text-slate-400 text-sm">Files Modified</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Trash className="w-8 h-8 text-red-400" />
                    <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Deleted</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">{stats.deleted}</div>
                  <p className="text-slate-400 text-sm">Files Deleted</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <HardDrive className="w-8 h-8 text-yellow-400" />
                    <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">USB</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">{stats.usbEvents}</div>
                  <p className="text-slate-400 text-sm">USB Events</p>
                </CardContent>
              </Card>
            </div>

            {/* File Activity Table */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-white">File Activity Log</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <Input 
                        placeholder="Search files..." 
                        className="bg-slate-900 border-slate-600 text-white pl-10 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        data-testid="input-search-files"
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
                        <th className="text-left py-3 text-sm font-medium text-slate-400">Operation</th>
                        <th className="text-left py-3 text-sm font-medium text-slate-400">File</th>
                        <th className="text-left py-3 text-sm font-medium text-slate-400">Path</th>
                        <th className="text-right py-3 text-sm font-medium text-slate-400">Size</th>
                        <th className="text-right py-3 text-sm font-medium text-slate-400">Timestamp</th>
                        <th className="text-right py-3 text-sm font-medium text-slate-400">Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fileLoading ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-slate-400">Loading file activity...</td>
                        </tr>
                      ) : filteredActivity.length > 0 ? (
                        filteredActivity.map((activity, index) => (
                          <tr key={activity.id} className="border-b border-slate-600/30 hover:bg-slate-700/50">
                            <td className="py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                                  {getOperationIcon(activity.operation)}
                                </div>
                                <div>
                                  <Badge className={getOperationColor(activity.operation)}>
                                    {activity.operation}
                                  </Badge>
                                </div>
                              </div>
                            </td>
                            <td className="py-4">
                              <div className="flex items-center space-x-3">
                                {getFileIcon(activity.fileName)}
                                <div>
                                  <div className="font-medium text-white" data-testid={`text-file-name-${index}`}>
                                    {activity.fileName}
                                  </div>
                                  {activity.isUsbDrive && (
                                    <div className="flex items-center space-x-1 mt-1">
                                      <HardDrive className="w-3 h-3 text-yellow-400" />
                                      <span className="text-xs text-yellow-400">USB Drive</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-4">
                              <div className="max-w-xs">
                                <div className="text-slate-300 text-sm truncate" title={activity.filePath}>
                                  {activity.filePath}
                                </div>
                                {activity.oldPath && activity.operation === 'renamed' && (
                                  <div className="text-slate-500 text-xs truncate mt-1" title={activity.oldPath}>
                                    From: {activity.oldPath}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="text-right py-4 text-slate-300 text-sm">
                              {formatFileSize(activity.fileSize)}
                            </td>
                            <td className="text-right py-4 text-slate-300 text-sm">
                              {formatDateTime(activity.timestamp)}
                            </td>
                            <td className="text-right py-4">
                              <div className="flex items-center justify-end space-x-2">
                                {activity.isUsbDrive && (
                                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                                )}
                                {activity.sessionId ? (
                                  <Badge variant="outline" className="border-slate-600 text-slate-300">
                                    {activity.sessionId.substring(0, 8)}...
                                  </Badge>
                                ) : (
                                  <span className="text-slate-400 text-sm">-</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-slate-400">
                            {searchTerm ? 'No file activity found matching your search' : 'No file activity available'}
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
