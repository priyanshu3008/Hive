import { cn } from "@/lib/utils";

export function SpaceBackground({ className }: { className?: string }) {
  return (
    <div 
      className={cn(
        "fixed inset-0 -z-10 bg-gradient-to-b from-background to-background/80",
        "before:absolute before:inset-0 before:bg-[radial-gradient(circle_400px_at_50%_300px,rgba(122,137,194,0.2),transparent)]",
        "after:absolute after:inset-0 after:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')]",
        "after:opacity-30 dark:after:opacity-50",
        className
      )}
    />
  );
}
