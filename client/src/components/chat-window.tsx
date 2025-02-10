import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageItem } from "./message-item";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, Send } from "lucide-react";
import type { Message } from "@shared/schema";

interface ChatWindowProps {
  username: string;
}

export function ChatWindow({ username }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
            title: "✨ Message Delivered!",
            description: "Your vibe has been shared! 🚀",
            duration: 2000,
          });
        }
      } else if (data.type === 'error') {
        toast({
          variant: "destructive",
          title: "Oops! 😅",
          description: data.message
        });
      }
    };

    return () => {
      ws.close();
    };
  }, [toast, username]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: "destructive",
          title: "File too large 😬",
          description: "Please choose a file under 5MB!"
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() && !file) return;

    let mediaUrl = "";
    let mediaType = "";

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!response.ok) throw new Error("Upload failed");
        const data = await response.json();
        mediaUrl = data.url;
        mediaType = file.type.startsWith('image/') ? 'image' : 'video';
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Upload failed 😭",
          description: "Couldn't upload your file, try again?"
        });
        return;
      }
    }

    wsRef.current?.send(JSON.stringify({
      username,
      content: input.trim(),
      mediaUrl,
      mediaType
    }));

    setInput("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-2xl mx-auto p-4 bg-background/40 backdrop-blur border-primary/20">
        <ScrollArea className="h-[60vh] mb-4 pr-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <MessageItem message={msg} />
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>

        <div className="space-y-2">
          {file && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-primary"
            >
              📎 {file.name}
            </motion.div>
          )}

          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*,video/*"
              className="hidden"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="shrink-0"
            >
              <ImagePlus className="h-5 w-5" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Drop your thoughts here... ✨"
              className="bg-background/60"
            />
            <Button onClick={sendMessage} className="shrink-0">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}