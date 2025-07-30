import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Application usage tracking
export const applicationUsage = pgTable("application_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationName: varchar("application_name").notNull(),
  processId: integer("process_id"),
  windowTitle: varchar("window_title"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  duration: integer("duration"), // in seconds
  userId: varchar("user_id"),
  sessionId: varchar("session_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Clipboard monitoring
export const clipboardActivity = pgTable("clipboard_activity", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  content: text("content"),
  contentType: varchar("content_type"), // text, image, file
  contentHash: varchar("content_hash"), // for privacy/security
  timestamp: timestamp("timestamp").notNull(),
  userId: varchar("user_id"),
  sessionId: varchar("session_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Communication monitoring
export const communicationActivity = pgTable("communication_activity", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: varchar("type").notNull(), // email, message, call
  application: varchar("application"), // outlook, teams, skype, etc.
  contact: varchar("contact"), // email or phone
  subject: varchar("subject"),
  direction: varchar("direction"), // incoming, outgoing
  timestamp: timestamp("timestamp").notNull(),
  duration: integer("duration"), // for calls
  userId: varchar("user_id"),
  sessionId: varchar("session_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// File access monitoring
export const fileAccessActivity = pgTable("file_access_activity", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filePath: text("file_path").notNull(),
  fileName: varchar("file_name").notNull(),
  operation: varchar("operation").notNull(), // created, modified, deleted, renamed, accessed
  oldPath: text("old_path"), // for rename operations
  fileSize: integer("file_size"),
  timestamp: timestamp("timestamp").notNull(),
  userId: varchar("user_id"),
  sessionId: varchar("session_id"),
  isUsbDrive: boolean("is_usb_drive").default(false),
  driveInfo: text("drive_info"), // USB drive details
  createdAt: timestamp("created_at").defaultNow(),
});

// Keystroke monitoring
export const keystrokeActivity = pgTable("keystroke_activity", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationName: varchar("application_name"),
  windowTitle: varchar("window_title"),
  keystrokeCount: integer("keystroke_count").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  timeWindow: integer("time_window").default(60), // aggregation window in seconds
  userId: varchar("user_id"),
  sessionId: varchar("session_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Network monitoring
export const networkActivity = pgTable("network_activity", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  destinationHost: varchar("destination_host").notNull(),
  destinationPort: integer("destination_port").notNull(),
  destinationIp: varchar("destination_ip"),
  protocol: varchar("protocol").notNull(), // TCP, UDP, HTTP, HTTPS, etc.
  connectionState: varchar("connection_state"), // established, closed, listening
  bytesReceived: integer("bytes_received"),
  bytesSent: integer("bytes_sent"),
  timestamp: timestamp("timestamp").notNull(),
  userId: varchar("user_id"),
  sessionId: varchar("session_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Website monitoring
export const webUsageActivity = pgTable("web_usage_activity", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  url: text("url").notNull(),
  domain: varchar("domain").notNull(),
  title: varchar("title"),
  category: varchar("category"), // work, social, entertainment, etc.
  visitDuration: integer("visit_duration"), // in seconds
  timestamp: timestamp("timestamp").notNull(),
  userId: varchar("user_id"),
  sessionId: varchar("session_id"),
  browserName: varchar("browser_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Monitoring sessions
export const monitoringSessions = pgTable("monitoring_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  deviceName: varchar("device_name").notNull(),
  userName: varchar("user_name"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  status: varchar("status").default("active"), // active, inactive, offline
  ipAddress: varchar("ip_address"),
  operatingSystem: varchar("operating_system"),
  lastActivity: timestamp("last_activity"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Create insert schemas
export const insertApplicationUsageSchema = createInsertSchema(applicationUsage);
export const insertClipboardActivitySchema = createInsertSchema(clipboardActivity);
export const insertCommunicationActivitySchema = createInsertSchema(communicationActivity);
export const insertFileAccessActivitySchema = createInsertSchema(fileAccessActivity);
export const insertKeystrokeActivitySchema = createInsertSchema(keystrokeActivity);
export const insertNetworkActivitySchema = createInsertSchema(networkActivity);
export const insertWebUsageActivitySchema = createInsertSchema(webUsageActivity);
export const insertMonitoringSessionSchema = createInsertSchema(monitoringSessions);

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type ApplicationUsage = typeof applicationUsage.$inferSelect;
export type InsertApplicationUsage = z.infer<typeof insertApplicationUsageSchema>;
export type ClipboardActivity = typeof clipboardActivity.$inferSelect;
export type InsertClipboardActivity = z.infer<typeof insertClipboardActivitySchema>;
export type CommunicationActivity = typeof communicationActivity.$inferSelect;
export type InsertCommunicationActivity = z.infer<typeof insertCommunicationActivitySchema>;
export type FileAccessActivity = typeof fileAccessActivity.$inferSelect;
export type InsertFileAccessActivity = z.infer<typeof insertFileAccessActivitySchema>;
export type KeystrokeActivity = typeof keystrokeActivity.$inferSelect;
export type InsertKeystrokeActivity = z.infer<typeof insertKeystrokeActivitySchema>;
export type NetworkActivity = typeof networkActivity.$inferSelect;
export type InsertNetworkActivity = z.infer<typeof insertNetworkActivitySchema>;
export type WebUsageActivity = typeof webUsageActivity.$inferSelect;
export type InsertWebUsageActivity = z.infer<typeof insertWebUsageActivitySchema>;
export type MonitoringSession = typeof monitoringSessions.$inferSelect;
export type InsertMonitoringSession = z.infer<typeof insertMonitoringSessionSchema>;
