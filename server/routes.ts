import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertMessageSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Broadcast to all clients
  function broadcast(message: any) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  wss.on('connection', async (ws) => {
    // Send existing messages on connect
    const messages = await storage.getMessages();
    ws.send(JSON.stringify({ type: 'init', messages }));

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        // Validate message format
        const validatedMessage = insertMessageSchema.parse(message);
        
        // Store and broadcast message
        const savedMessage = await storage.addMessage(validatedMessage);
        broadcast({ type: 'message', message: savedMessage });
      } catch (err) {
        ws.send(JSON.stringify({ 
          type: 'error', 
          message: 'Invalid message format'
        }));
      }
    });
  });

  return httpServer;
}
