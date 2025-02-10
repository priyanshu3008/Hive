import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageItem } from "./message-item";
import { useToast } from "@/hooks/use-toast";
import type { Message } from "@shared/schema";

interface ChatWindowProps {
  username: string;
}

export function ChatWindow({ username }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'init') {
        setMessages(data.messages);
      } else if (data.type === 'message') {
        setMessages(prev => [...prev, data.message]);
        if (data.message.username === username) {
          toast({
            title: "Message Delivered",
            description: "Your message has been sent successfully!",
            duration: 2000,
          });
        }
      } else if (data.type === 'error') {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message
        });
      }
    };

    return () => {
      ws.close();
    };
  }, [toast, username]);

  const sendMessage = () => {
    if (!input.trim()) return;

    wsRef.current?.send(JSON.stringify({
      username,
      content: input.trim()
    }));

    setInput("");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-4 bg-background/40 backdrop-blur border-primary/20">
      <ScrollArea className="h-[60vh] mb-4 pr-4">
        {messages.map((msg) => (
          <MessageItem key={msg.id} message={msg} />
        ))}
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="bg-background/60"
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </Card>
  );
}