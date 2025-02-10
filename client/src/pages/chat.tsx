import { useEffect, useState } from "react";
import { SpaceBackground } from "@/components/space-background";
import { ChatWindow } from "@/components/chat-window";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function Chat() {
  const [username, setUsername] = useState("");
  const [isUsernameSet, setIsUsernameSet] = useState(false);

  useEffect(() => {
    // Load Space Mono font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  if (!isUsernameSet) {
    return (
      <>
        <SpaceBackground />
        <div className="min-h-screen p-4 font-mono flex items-center justify-center">
          <Card className="w-full max-w-md p-6 space-y-4">
            <h1 className="text-2xl font-bold text-primary text-center">PDHive – Community-oriented vibe</h1>
            <div className="space-y-2">
              <Input
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-center"
              />
              <Button 
                className="w-full" 
                onClick={() => username.trim() && setIsUsernameSet(true)}
                disabled={!username.trim()}
              >
                Join Chat
              </Button>
            </div>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <SpaceBackground />
      <div className="min-h-screen p-4 font-mono">
        <header className="max-w-2xl mx-auto mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-primary">PDHive – Community-oriented vibe</h1>
            <ThemeToggle />
          </div>
          <p className="text-sm text-muted-foreground text-right">Made with 💖 by PRIYANSHU DUMADIYA</p>
        </header>
        <ChatWindow username={username} />
      </div>
    </>
  );
}