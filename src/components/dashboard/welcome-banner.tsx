"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSearchParams } from "next/navigation";

export default function WelcomeBanner() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || "Alex Johnson";
  const fallback = name.split(' ').map(n => n[0]).join('');
  const email = name.toLowerCase().replace(' ', '.') + "@university.edu";

  return (
    <div className="p-4 rounded-lg bg-card border flex items-center gap-4">
      <Avatar className="h-12 w-12">
        <AvatarImage src={`https://picsum.photos/seed/${name}/100/100`} alt={name} data-ai-hint="student avatar" />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-xl font-bold font-headline">
          {name}
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
