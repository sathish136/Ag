import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, Filter, Search, Clipboard, FileText, Image, File, Clock } from "lucide-react";

export default function ClipboardPage() {
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

  const { data: clipboardActivity, isLoading: clipboardLoading } = useQuery({
    queryKey: ["/api/clipboard"],
    retry: false,
  });

  if (!isAuthenticated || isLoading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType?.toLowerCase()) {
      case 'text': return <FileText className="w-5 h-5 text-blue-400" />;
      case 'image': return <Image className="w-5 h-5 text-green-400" />;
      case 'file': return <File className="w-5 h-5 text-yellow-400" />;
      default: return <Clipboard className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const truncateContent = (content: string, maxLength = 100) => {
    if (!content || content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const filteredActivity = clipboardActivity?.filter(activity =>
    activity.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.contentType?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const stats = {
    totalEvents: clipboardActivity?.length || 0,
    textEvents: clipboardActivity?.filter(a => a.contentType === 'text').length || 0,
    imageEvents: clipboardActivity?.filter(a => a.contentType === 'image').length || 0,
    fileEvents: clipboardActivity?.filter(a => a.contentType === 'file').length || 0,
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
                <h2 className="text-2xl font-bold text-white">Clipboard Monitoring</h2>
                <p className="text-slate-400">Track clipboard activities and content changes</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button className="bg-blue-500 hover:bg-blue-600" data-testid="button-export">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Clipboard className="w-8 h-8 text-blue-400" />
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
                    <FileText className="w-8 h-8 text-green-400" />
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Text</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">{stats.textEvents}</div>
                  <p className="text-slate-400 text-sm">Text Copies</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Image className="w-8 h-8 text-purple-400" />
                    <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">Images</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">{stats.imageEvents}</div>
                  <p className="text-slate-400 text-sm">Image Copies</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <File className="w-8 h-8 text-yellow-400" />
                    <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">Files</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">{stats.fileEvents}</div>
                  <p className="text-slate-400 text-sm">File Copies</p>
                </CardContent>
              </Card>
            </div>

            {/* Clipboard Activity Table */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-white">Clipboard Activity</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <Input 
                        placeholder="Search content..." 
                        className="bg-slate-900 border-slate-600 text-white pl-10 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        data-testid="input-search-clipboard"
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
                        <th className="text-left py-3 text-sm font-medium text-slate-400">Content Preview</th>
                        <th className="text-right py-3 text-sm font-medium text-slate-400">Timestamp</th>
                        <th className="text-right py-3 text-sm font-medium text-slate-400">Session</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clipboardLoading ? (
                        <tr>
                          <td colSpan={4} className="text-center py-8 text-slate-400">Loading clipboard activity...</td>
                        </tr>
                      ) : filteredActivity.length > 0 ? (
                        filteredActivity.map((activity, index) => (
                          <tr key={activity.id} className="border-b border-slate-600/30 hover:bg-slate-700/50">
                            <td className="py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                                  {getContentTypeIcon(activity.contentType)}
                                </div>
                                <div>
                                  <div className="font-medium text-white capitalize" data-testid={`text-content-type-${index}`}>
                                    {activity.contentType || 'Unknown'}
                                  </div>
                                  {activity.contentHash && (
                                    <div className="text-xs text-slate-400">
                                      Hash: {activity.contentHash.substring(0, 8)}...
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-4">
                              <div className="max-w-md">
                                {activity.contentType === 'text' && activity.content ? (
                                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-600">
                                    <code className="text-sm text-slate-300 break-words" data-testid={`text-content-preview-${index}`}>
                                      {truncateContent(activity.content)}
                                    </code>
                                  </div>
                                ) : activity.contentType === 'image' ? (
                                  <div className="flex items-center space-x-2 text-slate-400">
                                    <Image className="w-4 h-4" />
                                    <span className="text-sm">Image copied to clipboard</span>
                                  </div>
                                ) : activity.contentType === 'file' ? (
                                  <div className="flex items-center space-x-2 text-slate-400">
                                    <File className="w-4 h-4" />
                                    <span className="text-sm">File copied to clipboard</span>
                                  </div>
                                ) : (
                                  <span className="text-slate-400 text-sm">Content not available</span>
                                )}
                              </div>
                            </td>
                            <td className="text-right py-4 text-slate-300 text-sm">
                              <div className="flex items-center justify-end space-x-1">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <span>{formatDateTime(activity.timestamp)}</span>
                              </div>
                            </td>
                            <td className="text-right py-4">
                              {activity.sessionId ? (
                                <Badge variant="outline" className="border-slate-600 text-slate-300">
                                  {activity.sessionId.substring(0, 8)}...
                                </Badge>
                              ) : (
                                <span className="text-slate-400 text-sm">-</span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center py-8 text-slate-400">
                            {searchTerm ? 'No clipboard activity found matching your search' : 'No clipboard activity available'}
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
