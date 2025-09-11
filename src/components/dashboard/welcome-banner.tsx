
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname, useSearchParams } from "next/navigation";
import { useTimetable } from "@/context/TimetableContext";

export default function WelcomeBanner() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isFaculty = pathname.startsWith('/dashboard/faculty');
  const { batches } = useTimetable();

  const studentName = searchParams.get('name') || "Alex Johnson";
  const facultyName = "Dr. Evelyn Reed";
  const name = isFaculty ? facultyName : studentName;
  
  const fallback = name.split(' ').map(n => n[0]).join('');

  return (
    <div className="p-4 rounded-lg bg-card border flex items-center gap-4">
      <Avatar className="h-12 w-12">
        <AvatarImage 
          src={`https://picsum.photos/seed/${isFaculty ? 'faculty1' : name}/100/100`} 
          alt={name} 
          data-ai-hint={isFaculty ? "female professor" : "student avatar"}
        />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-xl font-bold font-headline">
          {name}
        </h1>
        {isFaculty ? (
            <div className="text-sm text-muted-foreground flex items-center gap-4">
                <span>ID: EMP-CS-001</span>
                <span className="h-4 border-l"></span>
                <span>Department: Engineering</span>
            </div>
        ) : (
            <div className="text-sm text-muted-foreground flex items-center gap-4">
                <span>Roll: CS2023001</span>
                <span className="h-4 border-l"></span>
                <span>Batch: {batches.length > 0 ? batches[0] : 'Computer Science 2023'}</span>
            </div>
        )}
      </div>
    </div>
  );
}
