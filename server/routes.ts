import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertApplicationUsageSchema,
  insertClipboardActivitySchema,
  insertCommunicationActivitySchema,
  insertFileAccessActivitySchema,
  insertKeystrokeActivitySchema,
  insertNetworkActivitySchema,
  insertWebUsageActivitySchema,
  insertMonitoringSessionSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard stats
  app.get('/api/dashboard/stats', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  app.get('/api/dashboard/activity', isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const activity = await storage.getRecentActivity(limit);
      res.json(activity);
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      res.status(500).json({ message: "Failed to fetch recent activity" });
    }
  });

  // Application usage endpoints
  app.post('/api/appusage', async (req, res) => {
    try {
      const data = insertApplicationUsageSchema.parse(req.body);
      const result = await storage.insertApplicationUsage(data);
      res.json(result);
    } catch (error) {
      console.error("Error logging application usage:", error);
      res.status(400).json({ message: "Invalid application usage data" });
    }
  });

  app.get('/api/appusage', isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const usage = await storage.getApplicationUsage(limit, offset);
      res.json(usage);
    } catch (error) {
      console.error("Error fetching application usage:", error);
      res.status(500).json({ message: "Failed to fetch application usage" });
    }
  });

  app.get('/api/appusage/top', isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const topApps = await storage.getTopApplications(limit);
      res.json(topApps);
    } catch (error) {
      console.error("Error fetching top applications:", error);
      res.status(500).json({ message: "Failed to fetch top applications" });
    }
  });

  // Clipboard endpoints
  app.post('/api/clipboard', async (req, res) => {
    try {
      const data = insertClipboardActivitySchema.parse(req.body);
      const result = await storage.insertClipboardActivity(data);
      res.json(result);
    } catch (error) {
      console.error("Error logging clipboard activity:", error);
      res.status(400).json({ message: "Invalid clipboard data" });
    }
  });

  app.get('/api/clipboard', isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const activity = await storage.getClipboardActivity(limit, offset);
      res.json(activity);
    } catch (error) {
      console.error("Error fetching clipboard activity:", error);
      res.status(500).json({ message: "Failed to fetch clipboard activity" });
    }
  });

  // Communication endpoints
  app.post('/api/communication', async (req, res) => {
    try {
      const data = insertCommunicationActivitySchema.parse(req.body);
      const result = await storage.insertCommunicationActivity(data);
      res.json(result);
    } catch (error) {
      console.error("Error logging communication activity:", error);
      res.status(400).json({ message: "Invalid communication data" });
    }
  });

  app.get('/api/communication', isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const activity = await storage.getCommunicationActivity(limit, offset);
      res.json(activity);
    } catch (error) {
      console.error("Error fetching communication activity:", error);
      res.status(500).json({ message: "Failed to fetch communication activity" });
    }
  });

  // File access endpoints
  app.post('/api/fileaccess', async (req, res) => {
    try {
      const data = insertFileAccessActivitySchema.parse(req.body);
      const result = await storage.insertFileAccessActivity(data);
      res.json(result);
    } catch (error) {
      console.error("Error logging file access:", error);
      res.status(400).json({ message: "Invalid file access data" });
    }
  });

  app.get('/api/fileaccess', isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const activity = await storage.getFileAccessActivity(limit, offset);
      res.json(activity);
    } catch (error) {
      console.error("Error fetching file access activity:", error);
      res.status(500).json({ message: "Failed to fetch file access activity" });
    }
  });

  // Keystroke endpoints
  app.post('/api/keystrokes', async (req, res) => {
    try {
      const data = insertKeystrokeActivitySchema.parse(req.body);
      const result = await storage.insertKeystrokeActivity(data);
      res.json(result);
    } catch (error) {
      console.error("Error logging keystrokes:", error);
      res.status(400).json({ message: "Invalid keystroke data" });
    }
  });

  app.get('/api/keystrokes', isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const activity = await storage.getKeystrokeActivity(limit, offset);
      res.json(activity);
    } catch (error) {
      console.error("Error fetching keystroke activity:", error);
      res.status(500).json({ message: "Failed to fetch keystroke activity" });
    }
  });

  // Network endpoints
  app.post('/api/network', async (req, res) => {
    try {
      const data = insertNetworkActivitySchema.parse(req.body);
      const result = await storage.insertNetworkActivity(data);
      res.json(result);
    } catch (error) {
      console.error("Error logging network activity:", error);
      res.status(400).json({ message: "Invalid network data" });
    }
  });

  app.get('/api/network', isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const activity = await storage.getNetworkActivity(limit, offset);
      res.json(activity);
    } catch (error) {
      console.error("Error fetching network activity:", error);
      res.status(500).json({ message: "Failed to fetch network activity" });
    }
  });

  app.get('/api/network/active', isAuthenticated, async (req, res) => {
    try {
      const connections = await storage.getActiveConnections();
      res.json(connections);
    } catch (error) {
      console.error("Error fetching active connections:", error);
      res.status(500).json({ message: "Failed to fetch active connections" });
    }
  });

  // Web usage endpoints
  app.post('/api/webusage', async (req, res) => {
    try {
      const data = insertWebUsageActivitySchema.parse(req.body);
      const result = await storage.insertWebUsageActivity(data);
      res.json(result);
    } catch (error) {
      console.error("Error logging web usage:", error);
      res.status(400).json({ message: "Invalid web usage data" });
    }
  });

  app.get('/api/webusage', isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const activity = await storage.getWebUsageActivity(limit, offset);
      res.json(activity);
    } catch (error) {
      console.error("Error fetching web usage activity:", error);
      res.status(500).json({ message: "Failed to fetch web usage activity" });
    }
  });

  // Monitoring session endpoints
  app.post('/api/sessions', async (req, res) => {
    try {
      const data = insertMonitoringSessionSchema.parse(req.body);
      const result = await storage.insertMonitoringSession(data);
      res.json(result);
    } catch (error) {
      console.error("Error creating monitoring session:", error);
      res.status(400).json({ message: "Invalid session data" });
    }
  });

  app.get('/api/sessions', isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const sessions = await storage.getMonitoringSessions(limit, offset);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching monitoring sessions:", error);
      res.status(500).json({ message: "Failed to fetch monitoring sessions" });
    }
  });

  app.patch('/api/sessions/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      const { status, lastActivity } = req.body;
      await storage.updateSessionStatus(id, status, lastActivity ? new Date(lastActivity) : undefined);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating session status:", error);
      res.status(500).json({ message: "Failed to update session status" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received WebSocket message:', data);
        
        // Handle different message types
        if (data.type === 'subscribe') {
          // Client wants to subscribe to real-time updates
          ws.send(JSON.stringify({ type: 'subscribed', success: true }));
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });

    // Send periodic updates
    const interval = setInterval(async () => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          const stats = await storage.getDashboardStats();
          const activity = await storage.getRecentActivity(5);
          
          ws.send(JSON.stringify({
            type: 'update',
            data: {
              stats,
              activity
            }
          }));
        } catch (error) {
          console.error('Error sending WebSocket update:', error);
        }
      }
    }, 5000); // Update every 5 seconds

    ws.on('close', () => {
      clearInterval(interval);
    });
  });

  return httpServer;
}
