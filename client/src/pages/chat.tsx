import { useEffect, useState } from "react";
import { SpaceBackground } from "@/components/space-background";
import { ChatWindow } from "@/components/chat-window";
import { ThemeToggle } from "@/components/theme-toggle";
import { generateSpaceUsername } from "@/lib/constants";

export default function Chat() {
  const [username] = useState(() => generateSpaceUsername());

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

  return (
    <>
      <SpaceBackground />
      <div className="min-h-screen p-4 font-mono">
        <header className="max-w-2xl mx-auto mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Cosmic Chat</h1>
          <ThemeToggle />
        </header>
        <ChatWindow username={username} />
      </div>
    </>
  );
}
