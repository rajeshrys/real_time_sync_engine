import { Client } from "@stomp/stompjs";

let client: Client | null = null;

export function connectPresence() {

    const token = localStorage.getItem("accessToken");

    if (!token) {
        console.log("❌ No JWT token found");
        return;
    }

    client = new Client({

        brokerURL: "ws://localhost:3000/ws",

        connectHeaders: {
            Authorization: `Bearer ${token}`,
        },

        reconnectDelay: 5000,

        debug: (str) => {
            console.log("[STOMP]", str);
        },

        onConnect: () => {

            console.log("🟢 Presence WebSocket connected");

            client?.subscribe(
                "/topic/presence",
                (message) => {

                    console.log(
                        "📡 Presence update:",
                        message.body
                    );

                }
            );
        },

        onStompError: (frame) => {

            console.error(
                "❌ STOMP error:",
                frame.headers["message"]
            );

            console.error(frame.body);
        },

        onWebSocketError: (error) => {

            console.error(
                "❌ WebSocket error:",
                error
            );
        },

        onWebSocketClose: () => {

            console.log(
                "🔴 Presence WebSocket disconnected"
            );
        }
    });

    client.activate();
}


export function disconnectedPresence() {

    if (client) {

        client.deactivate();

        client = null;

        console.log(
            "🔴 Presence WebSocket stopped"
        );
    }
}

