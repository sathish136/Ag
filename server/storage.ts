import {
  users,
  applicationUsage,
  clipboardActivity,
  communicationActivity,
  fileAccessActivity,
  keystrokeActivity,
  networkActivity,
  webUsageActivity,
  monitoringSessions,
  type User,
  type UpsertUser,
  type ApplicationUsage,
  type InsertApplicationUsage,
  type ClipboardActivity,
  type InsertClipboardActivity,
  type CommunicationActivity,
  type InsertCommunicationActivity,
  type FileAccessActivity,
  type InsertFileAccessActivity,
  type KeystrokeActivity,
  type InsertKeystrokeActivity,
  type NetworkActivity,
  type InsertNetworkActivity,
  type WebUsageActivity,
  type InsertWebUsageActivity,
  type MonitoringSession,
  type InsertMonitoringSession,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, sql, count } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Application usage
  insertApplicationUsage(data: InsertApplicationUsage): Promise<ApplicationUsage>;
  getApplicationUsage(limit?: number, offset?: number): Promise<ApplicationUsage[]>;
  getTopApplications(limit?: number): Promise<any[]>;

  // Clipboard activity
  insertClipboardActivity(data: InsertClipboardActivity): Promise<ClipboardActivity>;
  getClipboardActivity(limit?: number, offset?: number): Promise<ClipboardActivity[]>;

  // Communication activity
  insertCommunicationActivity(data: InsertCommunicationActivity): Promise<CommunicationActivity>;
  getCommunicationActivity(limit?: number, offset?: number): Promise<CommunicationActivity[]>;

  // File access activity
  insertFileAccessActivity(data: InsertFileAccessActivity): Promise<FileAccessActivity>;
  getFileAccessActivity(limit?: number, offset?: number): Promise<FileAccessActivity[]>;

  // Keystroke activity
  insertKeystrokeActivity(data: InsertKeystrokeActivity): Promise<KeystrokeActivity>;
  getKeystrokeActivity(limit?: number, offset?: number): Promise<KeystrokeActivity[]>;
  getTotalKeystrokes(timeRange?: string): Promise<number>;

  // Network activity
  insertNetworkActivity(data: InsertNetworkActivity): Promise<NetworkActivity>;
  getNetworkActivity(limit?: number, offset?: number): Promise<NetworkActivity[]>;
  getActiveConnections(): Promise<NetworkActivity[]>;

  // Web usage activity
  insertWebUsageActivity(data: InsertWebUsageActivity): Promise<WebUsageActivity>;
  getWebUsageActivity(limit?: number, offset?: number): Promise<WebUsageActivity[]>;

  // Monitoring sessions
  insertMonitoringSession(data: InsertMonitoringSession): Promise<MonitoringSession>;
  getMonitoringSessions(limit?: number, offset?: number): Promise<MonitoringSession[]>;
  updateSessionStatus(id: string, status: string, lastActivity?: Date): Promise<void>;

  // Dashboard stats
  getDashboardStats(): Promise<any>;
  getRecentActivity(limit?: number): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Application usage
  async insertApplicationUsage(data: InsertApplicationUsage): Promise<ApplicationUsage> {
    const [result] = await db.insert(applicationUsage).values(data).returning();
    return result;
  }

  async getApplicationUsage(limit = 50, offset = 0): Promise<ApplicationUsage[]> {
    return await db
      .select()
      .from(applicationUsage)
      .orderBy(desc(applicationUsage.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getTopApplications(limit = 10): Promise<any[]> {
    return await db
      .select({
        applicationName: applicationUsage.applicationName,
        totalDuration: sql<number>`SUM(COALESCE(${applicationUsage.duration}, 0))`,
        sessionCount: count(applicationUsage.id),
      })
      .from(applicationUsage)
      .groupBy(applicationUsage.applicationName)
      .orderBy(desc(sql`SUM(COALESCE(${applicationUsage.duration}, 0))`))
      .limit(limit);
  }

  // Clipboard activity
  async insertClipboardActivity(data: InsertClipboardActivity): Promise<ClipboardActivity> {
    const [result] = await db.insert(clipboardActivity).values(data).returning();
    return result;
  }

  async getClipboardActivity(limit = 50, offset = 0): Promise<ClipboardActivity[]> {
    return await db
      .select()
      .from(clipboardActivity)
      .orderBy(desc(clipboardActivity.timestamp))
      .limit(limit)
      .offset(offset);
  }

  // Communication activity
  async insertCommunicationActivity(data: InsertCommunicationActivity): Promise<CommunicationActivity> {
    const [result] = await db.insert(communicationActivity).values(data).returning();
    return result;
  }

  async getCommunicationActivity(limit = 50, offset = 0): Promise<CommunicationActivity[]> {
    return await db
      .select()
      .from(communicationActivity)
      .orderBy(desc(communicationActivity.timestamp))
      .limit(limit)
      .offset(offset);
  }

  // File access activity
  async insertFileAccessActivity(data: InsertFileAccessActivity): Promise<FileAccessActivity> {
    const [result] = await db.insert(fileAccessActivity).values(data).returning();
    return result;
  }

  async getFileAccessActivity(limit = 50, offset = 0): Promise<FileAccessActivity[]> {
    return await db
      .select()
      .from(fileAccessActivity)
      .orderBy(desc(fileAccessActivity.timestamp))
      .limit(limit)
      .offset(offset);
  }

  // Keystroke activity
  async insertKeystrokeActivity(data: InsertKeystrokeActivity): Promise<KeystrokeActivity> {
    const [result] = await db.insert(keystrokeActivity).values(data).returning();
    return result;
  }

  async getKeystrokeActivity(limit = 50, offset = 0): Promise<KeystrokeActivity[]> {
    return await db
      .select()
      .from(keystrokeActivity)
      .orderBy(desc(keystrokeActivity.timestamp))
      .limit(limit)
      .offset(offset);
  }

  async getTotalKeystrokes(timeRange = '24h'): Promise<number> {
    const timeCondition = timeRange === '24h' 
      ? gte(keystrokeActivity.timestamp, new Date(Date.now() - 24 * 60 * 60 * 1000))
      : undefined;

    const [result] = await db
      .select({ total: sql<number>`SUM(${keystrokeActivity.keystrokeCount})` })
      .from(keystrokeActivity)
      .where(timeCondition);

    return result?.total || 0;
  }

  // Network activity
  async insertNetworkActivity(data: InsertNetworkActivity): Promise<NetworkActivity> {
    const [result] = await db.insert(networkActivity).values(data).returning();
    return result;
  }

  async getNetworkActivity(limit = 50, offset = 0): Promise<NetworkActivity[]> {
    return await db
      .select()
      .from(networkActivity)
      .orderBy(desc(networkActivity.timestamp))
      .limit(limit)
      .offset(offset);
  }

  async getActiveConnections(): Promise<NetworkActivity[]> {
    return await db
      .select()
      .from(networkActivity)
      .where(eq(networkActivity.connectionState, 'established'))
      .orderBy(desc(networkActivity.timestamp))
      .limit(20);
  }

  // Web usage activity
  async insertWebUsageActivity(data: InsertWebUsageActivity): Promise<WebUsageActivity> {
    const [result] = await db.insert(webUsageActivity).values(data).returning();
    return result;
  }

  async getWebUsageActivity(limit = 50, offset = 0): Promise<WebUsageActivity[]> {
    return await db
      .select()
      .from(webUsageActivity)
      .orderBy(desc(webUsageActivity.timestamp))
      .limit(limit)
      .offset(offset);
  }

  // Monitoring sessions
  async insertMonitoringSession(data: InsertMonitoringSession): Promise<MonitoringSession> {
    const [result] = await db.insert(monitoringSessions).values(data).returning();
    return result;
  }

  async getMonitoringSessions(limit = 50, offset = 0): Promise<MonitoringSession[]> {
    return await db
      .select()
      .from(monitoringSessions)
      .orderBy(desc(monitoringSessions.startTime))
      .limit(limit)
      .offset(offset);
  }

  async updateSessionStatus(id: string, status: string, lastActivity?: Date): Promise<void> {
    await db
      .update(monitoringSessions)
      .set({ 
        status, 
        lastActivity: lastActivity || new Date(),
        ...(status === 'inactive' && { endTime: new Date() })
      })
      .where(eq(monitoringSessions.id, id));
  }

  // Dashboard stats
  async getDashboardStats(): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [appCount] = await db
      .select({ count: count(applicationUsage.id) })
      .from(applicationUsage)
      .where(gte(applicationUsage.createdAt, today));

    const [keystrokeCount] = await db
      .select({ total: sql<number>`SUM(${keystrokeActivity.keystrokeCount})` })
      .from(keystrokeActivity)
      .where(gte(keystrokeActivity.timestamp, today));

    const [networkCount] = await db
      .select({ count: count(networkActivity.id) })
      .from(networkActivity)
      .where(gte(networkActivity.timestamp, today));

    const [activeSessionCount] = await db
      .select({ count: count(monitoringSessions.id) })
      .from(monitoringSessions)
      .where(eq(monitoringSessions.status, 'active'));

    return {
      activeApps: appCount?.count || 0,
      keystrokes: keystrokeCount?.total || 0,
      networkConnections: networkCount?.count || 0,
      activeSessions: activeSessionCount?.count || 0,
    };
  }

  async getRecentActivity(limit = 10): Promise<any[]> {
    // Get recent activities from all tables with unified format
    const activities = [];
    
    // Recent application launches
    const apps = await db
      .select()
      .from(applicationUsage)
      .orderBy(desc(applicationUsage.startTime))
      .limit(5);
    
    apps.forEach(app => {
      activities.push({
        type: 'application',
        title: `Application Launch: ${app.applicationName}`,
        description: `User launched ${app.applicationName}${app.processId ? ` - PID: ${app.processId}` : ''}`,
        timestamp: app.startTime,
        status: 'active'
      });
    });

    // Recent file access
    const files = await db
      .select()
      .from(fileAccessActivity)
      .orderBy(desc(fileAccessActivity.timestamp))
      .limit(5);
    
    files.forEach(file => {
      activities.push({
        type: 'file',
        title: `File ${file.operation}: ${file.fileName}`,
        description: `File ${file.operation} from ${file.filePath}`,
        timestamp: file.timestamp,
        status: 'info'
      });
    });

    // Recent network connections
    const network = await db
      .select()
      .from(networkActivity)
      .orderBy(desc(networkActivity.timestamp))
      .limit(5);
    
    network.forEach(conn => {
      activities.push({
        type: 'network',
        title: `Network Connection: ${conn.destinationHost}`,
        description: `${conn.protocol} connection ${conn.connectionState} to ${conn.destinationIp || conn.destinationHost}:${conn.destinationPort}`,
        timestamp: conn.timestamp,
        status: conn.connectionState === 'established' ? 'active' : 'info'
      });
    });

    // Sort by timestamp and return limited results
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }
}

export const storage = new DatabaseStorage();
