import { useEffect, useState, useCallback } from 'react';
import { useGetAllUsersQuery } from '../../../redux/api/usersApi';

export const useUserEvents = () => {
    const { refetch } = useGetAllUsersQuery();
    const [isConnected, setIsConnected] = useState(false);
    const [lastEvent, setLastEvent] = useState(null);
    const [connectionAttempts, setConnectionAttempts] = useState(0);

    const connectWebSocket = useCallback(() => {
        // Use environment variable or fallback to localhost
        const WS_URL = import.meta.env.REACT_APP_ADMIN_WS_URL || `ws://localhost:5000/ws`;

        console.log(`🔌 Connecting to WebSocket: ${WS_URL}`);
        const ws = new WebSocket(WS_URL);

        ws.onopen = () => {
            console.log('✅ Connected to admin WebSocket');
            setIsConnected(true);
            setConnectionAttempts(0);

            // Send authentication if needed
            // const token = localStorage.getItem('admin_token');
            // if (token) {
            //     ws.send(JSON.stringify({
            //         type: 'AUTH',
            //         token: token
            //     }));
            // }
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                console.log('📩 WebSocket message received:', message);

                switch (message.type) {
                    case 'CONNECTION_ESTABLISHED':
                        console.log('✅ Connection confirmed by server');
                        break;

                    case 'USER_LOGGED_IN':
                        console.log(`🔔 User logged in:`, message.data);
                        setLastEvent(message.data);

                        // Refetch users list
                        refetch();

                        // You can also show toast notification here
                        // toast.success(`${message.data.name} just logged in!`);
                        break;

                    case 'PONG':
                        console.log('🏓 Pong received');
                        break;

                    default:
                        console.log('Unknown message type:', message.type);
                }
            } catch (error) {
                console.error('❌ Error parsing WebSocket message:', error);
            }
        };

        ws.onerror = (error) => {
            console.error('❌ WebSocket error:', error);
            setIsConnected(false);
        };

        ws.onclose = (event) => {
            console.log('🔌 WebSocket disconnected:', event.code, event.reason);
            setIsConnected(false);

            // Auto-reconnect after 5 seconds (if not closed by user)
            if (event.code !== 1000) {
                setTimeout(() => {
                    console.log('🔄 Attempting to reconnect...');
                    setConnectionAttempts(prev => prev + 1);
                }, 5000);
            }
        };

        return ws;
    }, [refetch])

    useEffect(() => {
        let ws = null;

        // Connect immediately
        ws = connectWebSocket();

        // Cleanup on unmount
        return () => {
            if (ws) {
                ws.close(1000, 'Component unmounted');
            }
        };
    }, [connectWebSocket]);

    // Function to manually reconnect
    const reconnect = useCallback(() => {
        connectWebSocket();
    }, [connectWebSocket]);

    return {
        isConnected,
        lastEvent,
        reconnect,
        connectionAttempts
    };
};

