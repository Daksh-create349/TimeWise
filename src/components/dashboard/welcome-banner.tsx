"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function WelcomeBanner() {
  return (
    <div className="p-4 rounded-lg bg-card border flex items-center gap-4">
      <Avatar className="h-12 w-12">
        <AvatarImage src="https://picsum.photos/seed/aj/100/100" alt="Alex Johnson" data-ai-hint="student avatar" />
        <AvatarFallback>AJ</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-xl font-bold font-headline">
          Alex Johnson
        </h1>
        <div className="text-sm text-muted-foreground flex items-center gap-4">
          <span>Roll: CS2023001</span>
          <span className="h-4 border-l"></span>
          <span>Batch: Computer Science 2023</span>
        </div>
      </div>
    </div>
  );
}
