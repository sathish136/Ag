import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Monitor, Activity, Lock, Users, BarChart3 } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">SecureMonitor</h1>
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Comprehensive monitoring dashboard for tracking system activity, security events, and user behavior in real-time.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <Monitor className="w-8 h-8 text-blue-400 mb-2" />
              <CardTitle className="text-white">Real-time Monitoring</CardTitle>
              <CardDescription className="text-slate-400">
                Monitor applications, network activity, and system events as they happen.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <Activity className="w-8 h-8 text-green-400 mb-2" />
              <CardTitle className="text-white">Activity Tracking</CardTitle>
              <CardDescription className="text-slate-400">
                Track file access, clipboard usage, keystrokes, and communication activities.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <Lock className="w-8 h-8 text-red-400 mb-2" />
              <CardTitle className="text-white">Security Alerts</CardTitle>
              <CardDescription className="text-slate-400">
                Receive instant notifications about suspicious activities and security events.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <Users className="w-8 h-8 text-purple-400 mb-2" />
              <CardTitle className="text-white">Session Management</CardTitle>
              <CardDescription className="text-slate-400">
                Manage and monitor active user sessions across multiple devices.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <BarChart3 className="w-8 h-8 text-yellow-400 mb-2" />
              <CardTitle className="text-white">Analytics & Reports</CardTitle>
              <CardDescription className="text-slate-400">
                Generate detailed reports and analytics for audit trails and compliance.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <Shield className="w-8 h-8 text-cyan-400 mb-2" />
              <CardTitle className="text-white">Data Protection</CardTitle>
              <CardDescription className="text-slate-400">
                Secure data handling with role-based access control and encryption.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-slate-800 border-slate-700 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Ready to Get Started?</CardTitle>
              <CardDescription className="text-slate-400 text-lg">
                Access your monitoring dashboard and start tracking system activities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                size="lg" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3"
                onClick={() => window.location.href = '/api/login'}
                data-testid="button-login"
              >
                <Shield className="w-5 h-5 mr-2" />
                Access Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
