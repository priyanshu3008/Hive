import { Card } from "@/components/ui/card";
import { formatMessageTime } from "@/lib/utils";
import { type Message } from "@shared/schema";
import { motion } from "framer-motion";

export function MessageItem({ message }: { message: Message }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-4 mb-4 bg-background/60 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors">
        <div className="flex justify-between items-start mb-2">
          <span className="font-mono text-sm text-primary font-bold">
            ✨ {message.username} 
          </span>
          <span className="text-xs text-muted-foreground">
            {formatMessageTime(message.timestamp)}
          </span>
        </div>

        {message.mediaUrl && (
          <div className="mb-3">
            {message.mediaType === 'image' ? (
              <img 
                src={message.mediaUrl} 
                alt="Shared content"
                className="rounded-lg max-h-[300px] w-auto object-contain"
              />
            ) : (
              <video 
                controls 
                className="rounded-lg max-h-[300px] w-auto"
              >
                <source src={message.mediaUrl} type="video/mp4" />
                Your browser doesn't support video playback 😢
              </video>
            )}
          </div>
        )}

        <p className="text-foreground break-words">
          {message.content.split(' ').map((word, i) => (
            <span key={i} className="inline-block">
              {word.startsWith('#') ? (
                <span className="text-primary font-semibold">{word} </span>
              ) : word.startsWith('@') ? (
                <span className="text-secondary font-semibold">{word} </span>
              ) : (
                word + ' '
              )}
            </span>
          ))}
        </p>
      </Card>
    </motion.div>
  );
}