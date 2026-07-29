/**
 * WebSocket Service — Admin Panel
 *
 * Manages a single persistent WS connection to the backend.
 * Consumers can subscribe to specific message types via addListener()
 * and the service takes care of reconnection with exponential back-off.
 */

const WS_URL =
  import.meta.env.VITE_BACKEND_WS_URL ||
  import.meta.env.VITE_BACKEND_URL?.replace(/^http/, "ws")?.replace(/\/api$/, "/ws") ||
  "ws://localhost:5000/ws";

const MAX_RECONNECT_DELAY_MS = 30_000;
const INITIAL_RECONNECT_DELAY_MS = 1_000;

class WebSocketService {
  constructor() {
    this._ws = null;
    this._listeners = new Map(); // type → Set<callback>
    this._reconnectDelay = INITIAL_RECONNECT_DELAY_MS;
    this._reconnectTimer = null;
    this._intentionalClose = false;
  }

  /** Connect (or reconnect) to the backend WS. */
  connect() {
    if (this._ws && this._ws.readyState === WebSocket.OPEN) return;

    this._intentionalClose = false;
    console.log(`🔌 [WS] Connecting to ${WS_URL}`);
    this._ws = new WebSocket(WS_URL);

    this._ws.onopen = () => {
      console.log("✅ [WS] Connected to backend WebSocket");
      this._reconnectDelay = INITIAL_RECONNECT_DELAY_MS; // reset back-off
      // Send AUTH if needed (optional – extend if backend validates token)
      this._ws.send(JSON.stringify({ type: "PING" }));
    };

    this._ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        const handlers = this._listeners.get(msg.type);
        if (handlers) {
          handlers.forEach((fn) => fn(msg.data, msg));
        }
        // Also fire "*" wildcard listeners
        const wildcards = this._listeners.get("*");
        if (wildcards) {
          wildcards.forEach((fn) => fn(msg.data, msg));
        }
      } catch (err) {
        console.warn("[WS] Failed to parse message:", event.data, err);
      }
    };

    this._ws.onclose = (event) => {
      console.warn(`🔌 [WS] Disconnected (code ${event.code})`);
      if (!this._intentionalClose) {
        this._scheduleReconnect();
      }
    };

    this._ws.onerror = (err) => {
      console.error("[WS] Error:", err);
    };
  }

  /** Gracefully close the connection (no reconnect). */
  disconnect() {
    this._intentionalClose = true;
    clearTimeout(this._reconnectTimer);
    this._ws?.close(1000, "Intentional disconnect");
    this._ws = null;
  }

  /**
   * Subscribe to a WebSocket message type.
   * @param {string} type - e.g. 'NEW_APPLICATION', 'USER_LOGGED_IN', '*' (all)
   * @param {Function} callback - fn(data, fullMessage)
   * @returns {Function} unsubscribe function
   */
  addListener(type, callback) {
    if (!this._listeners.has(type)) {
      this._listeners.set(type, new Set());
    }
    this._listeners.get(type).add(callback);

    // Return an unsubscribe fn
    return () => {
      this._listeners.get(type)?.delete(callback);
    };
  }

  _scheduleReconnect() {
    clearTimeout(this._reconnectTimer);
    console.log(`🔄 [WS] Reconnecting in ${this._reconnectDelay}ms…`);
    this._reconnectTimer = setTimeout(() => {
      this.connect();
    }, this._reconnectDelay);

    // Exponential back-off
    this._reconnectDelay = Math.min(
      this._reconnectDelay * 2,
      MAX_RECONNECT_DELAY_MS
    );
  }
}

// Singleton instance shared across the whole admin panel
const wsService = new WebSocketService();
export default wsService;
