# SecureMonitor - Agent Activity Monitoring Dashboard

## Overview

SecureMonitor is a comprehensive monitoring dashboard built to track system activity, security events, and user behavior in real-time. The application uses a modern tech stack with React/TypeScript frontend, Express.js backend, and PostgreSQL database with Drizzle ORM for data management.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**July 30, 2025 - Complete System Integration & Fix**
- Migrated project from Replit Agent to standard Replit environment
- Created PostgreSQL database and configured environment variables
- Fixed session management with auto-generated secure secrets
- **Critical Fix**: Updated all insert schemas to accept ISO timestamp strings from local clients
- Removed authentication requirements from data retrieval endpoints for monitoring dashboard
- **RESOLVED**: Fixed "BadRequestError: request aborted" by removing WebSocket broadcast conflicts
- Added comprehensive logging to all POST endpoints for real-time monitoring
- Increased request timeout limits and payload size for better client compatibility
- **SUCCESS**: All endpoints now working seamlessly with local PC agent
- Created public /monitor route for non-authenticated dashboard access
- Dashboard displays real-time activity feed with live data from agent
- Verified data flow: Application usage, file access, keystrokes, network activity all storing correctly

## System Architecture

The application follows a monorepo structure with clear separation between client-side and server-side code:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Real-time Communication**: WebSocket connection for live updates

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Authentication**: Replit OAuth integration with session management
- **WebSocket**: Native WebSocket server for real-time data streaming
- **API Design**: RESTful endpoints with consistent error handling

### Data Storage
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Session Storage**: PostgreSQL-based session store using connect-pg-simple
- **Migrations**: Drizzle Kit for database schema management

## Key Components

### Authentication System
- **Provider**: Replit OAuth with OpenID Connect
- **Session Management**: Secure HTTP-only cookies with PostgreSQL storage
- **User Management**: User profiles stored with email, names, and profile images
- **Authorization**: Route-level protection with authentication middleware

### Monitoring Data Models
The system tracks multiple types of user activities:
- **Application Usage**: Process monitoring, window titles, usage duration
- **Clipboard Activity**: Content type tracking, timestamps
- **Communication**: Email, messages, calls with contact information
- **File Access**: File operations (create, modify, delete) with paths
- **Keystroke Activity**: Keyboard input monitoring with context
- **Network Activity**: Connection tracking, protocols, bandwidth
- **Web Usage**: URL visits, categories, time spent

### Dashboard Features
- **Real-time Statistics**: Live counters for active applications, keystrokes, network connections
- **Activity Feed**: Recent activity stream with filtering and search
- **Session Management**: Active monitoring session tracking
- **Data Visualization**: Charts and graphs for usage patterns
- **Export Functionality**: Data export capabilities for reporting

### UI Components
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Dark Theme**: Consistent dark theme across all interfaces
- **Interactive Elements**: Hover states, loading indicators, error boundaries
- **Accessibility**: ARIA labels, keyboard navigation support

## Data Flow

### Client-Server Communication
1. **Authentication Flow**: OAuth redirect → token exchange → session creation
2. **API Requests**: Authenticated HTTP requests with credential inclusion
3. **Real-time Updates**: WebSocket connection for live data streaming
4. **Error Handling**: Centralized error processing with user-friendly messages

### Data Processing Pipeline
1. **Data Ingestion**: Various activity sources feed into the system
2. **Storage**: Normalized data storage in PostgreSQL tables
3. **Aggregation**: Real-time statistics calculation and caching
4. **Presentation**: Formatted data delivery to frontend components

## External Dependencies

### Core Libraries
- **React Ecosystem**: React, React DOM, React Hook Form
- **UI Components**: Radix UI primitives, Lucide React icons
- **Development Tools**: Vite, TypeScript, Tailwind CSS
- **Database**: Drizzle ORM, Neon PostgreSQL driver
- **Authentication**: OpenID Client, Passport.js strategies

### Replit Integration
- **Environment**: Configured for Replit hosting environment
- **Development Tools**: Replit-specific Vite plugins for enhanced development
- **Authentication**: Native Replit OAuth integration

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite development server with HMR
- **Database**: Development PostgreSQL instance
- **Environment Variables**: Local .env configuration

### Production Build
- **Frontend**: Static asset generation with Vite build
- **Backend**: ES module bundling with esbuild
- **Optimization**: Asset optimization, code splitting, tree shaking

### Hosting Configuration
- **Server**: Express.js serving both API and static assets
- **Database**: Production PostgreSQL with connection pooling
- **Session Storage**: PostgreSQL-backed session management
- **Security**: HTTPS enforcement, secure cookie settings

### Environment Requirements
- **Node.js**: ES module support with import/export syntax
- **Database**: PostgreSQL with UUID extension support
- **Environment Variables**: DATABASE_URL, SESSION_SECRET, REPLIT_DOMAINS
- **WebSocket**: Support for real-time bidirectional communication