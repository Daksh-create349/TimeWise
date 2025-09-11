
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import type { BatchTimetables, Schedule } from "@/context/TimetableContext";
import TimetableTabs from "./timetable-tabs";

interface TimetableDisplayProps {
  schedules: BatchTimetables | null;
  onPublish: (batchName: string, schedule: Schedule) => void;
}

export default function TimetableDisplay({ schedules, onPublish }: TimetableDisplayProps) {
  if (!schedules) {
    return (
      <Card className="h-full flex flex-col items-center justify-center text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit">
            <Calendar className="h-8 w-8" />
          </div>
          <CardTitle className="font-headline text-2xl mt-4">Generated Timetables</CardTitle>
          <CardDescription>
            Your AI-generated schedules for each batch will appear here once they're created.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Fill out the form on the left and click "Generate with AI" to begin.
          </p>
        </CardContent>
      </Card>
    );
  }

  return <TimetableTabs schedules={schedules} onPublish={onPublish} />;
}
