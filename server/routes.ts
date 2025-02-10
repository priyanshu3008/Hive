import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertMessageSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import { nanoid } from "nanoid";
import express from 'express';


export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Configure multer for file uploads
  const upload = multer({
    storage: multer.diskStorage({
      destination: './uploads',
      filename: (_, file, cb) => {
        const uniqueName = `${nanoid()}-${file.originalname}`;
        cb(null, uniqueName);
      }
    }),
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    }
  });

  // Ensure uploads directory exists
  app.use(express.static('uploads'));


  // File upload endpoint
  app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  });

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