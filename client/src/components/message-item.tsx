import { Card } from "@/components/ui/card";
import { formatMessageTime } from "@/lib/utils";
import { type Message } from "@shared/schema";

export function MessageItem({ message }: { message: Message }) {
  return (
    <Card className="p-4 mb-4 bg-background/60 backdrop-blur-sm border-primary/20">
      <div className="flex justify-between items-start mb-2">
        <span className="font-mono text-sm text-primary">{message.username}</span>
        <span className="text-xs text-muted-foreground">
          {formatMessageTime(message.timestamp)}
        </span>
      </div>
      <p className="text-foreground">{message.content}</p>
    </Card>
  );
}
