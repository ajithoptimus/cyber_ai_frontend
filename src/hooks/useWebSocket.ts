// Phase 6E: WebSocket Hook for Real-time Data

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

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        reconnectCountRef.current = 0;
        const pingInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send('ping');
          }
        }, 30000);
        ws.onclose = () => clearInterval(pingInterval);
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage<T> = JSON.parse(event.data);
          if (message.type === 'keepalive' || event.data === 'pong') return;
          setData(message.data);
          onMessage?.(message.data);
        } catch (err) {
          // Ignore non-JSON/pong
        }
      };

      ws.onerror = (event) => {
        setError('WebSocket connection error');
        onError?.(event);
      };

      ws.onclose = () => {
        setIsConnected(false);
        if (reconnectCountRef.current < reconnectAttempts) {
          reconnectCountRef.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectDelay);
        } else {
          setError('WebSocket connection failed after maximum reconnection attempts');
        }
      };

      wsRef.current = ws;

    } catch (err) {
      setError('Failed to establish WebSocket connection');
    }
  }, [url, onMessage, onError, reconnectAttempts, reconnectDelay]);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    data,
    isConnected,
    error,
    reconnect: connect,
    disconnect
  };
};
