import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface WebSocketData {
  stats?: {
    activeApps?: number;
    keystrokes?: number;
    networkConnections?: number;
    activeSessions?: number;
  };
  activity?: Array<{
    type: string;
    title: string;
    description: string;
    timestamp: string;
    status: string;
  }>;
}

export function useWebSocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState<WebSocketData['stats']>();
  const [activity, setActivity] = useState<WebSocketData['activity']>([]);
  const { toast } = useToast();

  const connect = useCallback(() => {
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setSocket(ws);
        
        // Subscribe to updates
        ws.send(JSON.stringify({ type: 'subscribe' }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'update' && data.data) {
            if (data.data.stats) {
              setStats(data.data.stats);
            }
            if (data.data.activity) {
              setActivity(data.data.activity);
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setSocket(null);
        
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          connect();
        }, 5000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to real-time updates",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    connect();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [connect]);

  return {
    isConnected,
    stats,
    activity,
    socket
  };
}
