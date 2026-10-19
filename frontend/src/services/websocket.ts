import { Client,type IMessage } from "@stomp/stompjs";

let client: Client | null = null;

export const connectToDocument = (
  documentId: number,
  onMessage: (message: any) => void
) => {

  client = new Client({

    brokerURL: "ws://localhost:3000/ws",

    reconnectDelay: 5000,

    onConnect: () => {

      console.log("WebSocket connected");

      client?.subscribe(
        `/topic/document/${documentId}`,

        (message: IMessage) => {

          const data = JSON.parse(
            message.body
          );

          onMessage(data);
        }
      );
    },

    onDisconnect: () => {
      console.log("WebSocket disconnected");
    },

    onStompError: (frame) => {

      console.error(
        "STOMP error:",
        frame.headers["message"]
      );
    },
  });

  client.activate();
};


export const sendDocumentChange = (
  documentId: number,
  content: any,
  userId?: number
) => {

  if (!client || !client.connected) {

    console.warn(
      "WebSocket is not connected"
    );

    return;
  }

  client.publish({

    destination: "/app/document",

    body: JSON.stringify({

      documentId,

      type: "CONTENT_UPDATE",

      content,

      userId,
    }),
  });
};


export const disconnectWebSocket = () => {

  if (client) {

    client.deactivate();

    client = null;
  }
};