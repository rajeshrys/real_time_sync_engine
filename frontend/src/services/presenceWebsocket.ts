import { Client, type IMessage } from "@stomp/stompjs";

export interface PresenceEvent {
    userId: number;
    email: string;
    status: "ONLINE" | "OFFLINE";
}

let client: Client | null = null;
const listeners = new Set<(event: PresenceEvent) => void>();
const connectListeners = new Set<() => void>();

// Call after login, and on app startup if a token exists
export const startPresence = () => {
    if (client) return;                                   // already running
    if (!localStorage.getItem("accessToken")) return;

    const c = new Client({
        brokerURL: import.meta.env.VITE_WS_URL ?? "ws://localhost:3000/ws",
        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        beforeConnect: () => {
            // fresh token on every (re)connect attempt
            c.connectHeaders = {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            };
        },
        onConnect: () => {
            c.subscribe("/topic/presence", (message: IMessage) => {
                try {
                    const event = JSON.parse(message.body) as PresenceEvent;
                    listeners.forEach((l) => l(event));
                } catch (e) {
                    console.error("Invalid presence event:", e);
                }
            });
            connectListeners.forEach((fn) => fn());       // tell UI to re-sync
        },
        onStompError: (f) => console.error("Presence STOMP error:", f.headers["message"]),
        onWebSocketError: (e) => console.error("Presence WebSocket error:", e),
    });

    client = c;
    c.activate();
};

// Call ONLY on logout
export const stopPresence = async () => {
    const c = client;
    client = null;                                        // clear BEFORE awaiting
    if (c) await c.deactivate();
};

// Components use these; they never open or close the socket
export const subscribeToPresence = (fn: (e: PresenceEvent) => void) => {
    listeners.add(fn);
    return () => { listeners.delete(fn); };
};

export const onPresenceConnected = (fn: () => void) => {
    connectListeners.add(fn);
    return () => { connectListeners.delete(fn); };
};