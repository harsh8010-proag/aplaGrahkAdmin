// src/hooks/useAdminWebSocket.js
import { useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';

export const useAdminWebSocket = (onUserLogin) => {
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const isMountedRef = useRef(true);

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        if (wsRef.current) {
            if (wsRef.current.readyState === WebSocket.OPEN ||
                wsRef.current.readyState === WebSocket.CONNECTING) {
                wsRef.current.close(1000, 'Manual disconnect');
            }
            wsRef.current = null;
            setIsConnected(false);
        }
    }, []);

    const connect = useCallback(() => {
        // Don't connect if already connected or connecting
        if (wsRef.current &&
            (wsRef.current.readyState === WebSocket.OPEN ||
                wsRef.current.readyState === WebSocket.CONNECTING)) {
            console.log('WebSocket already connected or connecting');
            return;
        }

        // Clear any pending reconnect timeout
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        const WS_URL = import.meta.env.VITE_ADMIN_WS_URL || 'ws://localhost:5000/ws';
        console.log(`🔌 Connecting to WebSocket: ${WS_URL}?role=admin`);

        const wsConnection = new WebSocket(`${WS_URL}?role=admin`);

        wsConnection.onopen = () => {
            if (!isMountedRef.current) return;
            console.log('✅ Admin WebSocket connected');
            setIsConnected(true);

            // Send authentication
            const token = localStorage.getItem('adminToken');
            if (token) {
                wsConnection.send(JSON.stringify({
                    type: 'AUTH',
                    role: 'admin'
                }));
            }
        };

        wsConnection.onmessage = (event) => {
            if (!isMountedRef.current) return;
            try {
                const message = JSON.parse(event.data);
                console.log('📩 WebSocket message:', message);

                if (message.type === 'USER_LOGGED_IN') {
                    if (onUserLogin) {
                        onUserLogin(message.data);
                    }
                    toast.success(`🔔 ${message.data.name || 'User'} just logged in!`);
                } else if (message.type === 'CONNECTION_ESTABLISHED') {
                    console.log('✅ Connection confirmed by server:', message.message);
                }
            } catch (error) {
                console.error('❌ WebSocket message error:', error);
            }
        };

        wsConnection.onerror = (error) => {
            console.error('❌ WebSocket error:', error);
            if (isMountedRef.current) {
                setIsConnected(false);
            }
        };

        wsConnection.onclose = (event) => {
            if (!isMountedRef.current) return;
            console.log(`🔌 WebSocket disconnected (Code: ${event.code})`);
            setIsConnected(false);
            wsRef.current = null;

            // Only reconnect if not manually closed and component is mounted
            if (event.code !== 1000 && isMountedRef.current) {
                console.log('🔄 Attempting to reconnect in 5 seconds...');
                reconnectTimeoutRef.current = setTimeout(() => {
                    if (isMountedRef.current) {
                        console.log('🔄 Reconnecting WebSocket...');
                        connect();
                    }
                }, 5000);
            }
        };

        wsRef.current = wsConnection;
    }, [onUserLogin]);

    // Connect on mount
    useEffect(() => {
        isMountedRef.current = true;
        connect();

        // Cleanup on unmount
        return () => {
            isMountedRef.current = false;
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
            if (wsRef.current) {
                if (wsRef.current.readyState === WebSocket.OPEN ||
                    wsRef.current.readyState === WebSocket.CONNECTING) {
                    wsRef.current.close(1000, 'Component unmounted');
                }
                wsRef.current = null;
            }
            setIsConnected(false);
        };
    }, []); // Empty dependency array - connect only on mount

    return { isConnected, disconnect };
};