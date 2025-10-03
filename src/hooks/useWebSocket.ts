import { useState, useEffect, useCallback, useRef } from 'react';

interface WebSocketMessage<T = any> {
  type: string;
  timestamp: string;
  data: T;
}

interface UseWebSocketOptions {
  url: string;
  onMessage?: (data: any) => void;
  onError?: (error: Event) => void;
  reconnectAttempts?: number;
  reconnectDelay?: number;
}

export const useWebSocket = <T = any>({
  url,
  onMessage,
  onError,
  reconnectAttempts = 5,
  reconnectDelay = 3000
}: UseWebSocketOptions) => {
  const [data, setData] = useState<T | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const pingIntervalRef = useRef<NodeJS.Timeout>();
  const isMountedRef = useRef(true); // ADD THIS

  const disconnect = useCallback(() => {
    console.log('🛑 Disconnecting WebSocket');
    
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = undefined;
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Component unmounting');
      wsRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = undefined;
    }
  }, []);

  const connect = useCallback(() => {
    // Don't connect if component unmounted
    if (!isMountedRef.current) return;
    
    try {
      console.log('🔄 Connecting to WebSocket:', url);
      const ws = new WebSocket(url);

      ws.onopen = () => {
        if (!isMountedRef.current) {
          ws.close();
          return;
        }
        
        console.log(`✅ WebSocket connected: ${url}`);
        setIsConnected(true);
        setError(null);
        reconnectCountRef.current = 0;
        
        // Send ping every 25 seconds to keep connection alive
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            console.log('📤 Sending ping');
            ws.send('ping');
          }
        }, 25000);
      };

      ws.onmessage = (event) => {
        if (!isMountedRef.current) return;
        
        try {
          console.log('📥 WebSocket raw message:', event.data);
          
          // Handle pong response
          if (event.data === 'pong') {
            console.log('📥 Received pong');
            return;
          }
          
          const message: WebSocketMessage<T> = JSON.parse(event.data);
          
          // Handle keepalive
          if (message.type === 'keepalive') {
            console.log('📥 Received keepalive');
            return;
          }
          
          // Handle actual data
          console.log('📊 Received data:', message.data);
          setData(message.data);
          onMessage?.(message.data);
        } catch (err) {
          console.error('❌ Error parsing WebSocket message:', err);
        }
      };

      ws.onerror = (event) => {
        console.error(`❌ WebSocket error:`, event);
        setError('WebSocket connection error');
        onError?.(event);
      };

      ws.onclose = (event) => {
        console.log(`🔌 WebSocket closed:`, event.code, event.reason);
        setIsConnected(false);
        
        // Clear ping interval
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = undefined;
        }
        
        // Only reconnect if component is still mounted and not a normal closure
        if (isMountedRef.current && event.code !== 1000 && reconnectCountRef.current < reconnectAttempts) {
          reconnectCountRef.current++;
          console.log(`🔄 Reconnecting... (${reconnectCountRef.current}/${reconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectDelay);
        } else if (reconnectCountRef.current >= reconnectAttempts) {
          setError('WebSocket connection failed after maximum reconnection attempts');
        }
      };

      wsRef.current = ws;

    } catch (err) {
      console.error('❌ WebSocket connection error:', err);
      setError('Failed to establish WebSocket connection');
    }
  }, [url, onMessage, onError, reconnectAttempts, reconnectDelay]);

  useEffect(() => {
    isMountedRef.current = true;
    connect();
    
    return () => {
      isMountedRef.current = false;
      disconnect();
    };
  }, [url]); // ONLY url in dependencies!

  return {
    data,
    isConnected,
    error,
    reconnect: connect,
    disconnect
  };
};
