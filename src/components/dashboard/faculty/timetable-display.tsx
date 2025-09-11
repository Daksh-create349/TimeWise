
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle } from "lucide-react";
import type { Schedule } from "@/context/TimetableContext";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

interface TimetableDisplayProps {
  schedule: Schedule | null;
  onPublish: (schedule: Schedule) => void;
}

export default function TimetableDisplay({ schedule, onPublish }: TimetableDisplayProps) {
  if (!schedule) {
    return (
      <Card className="h-full flex flex-col items-center justify-center text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit">
            <Calendar className="h-8 w-8" />
          </div>
          <CardTitle className="font-headline text-2xl mt-4">Generated Timetable</CardTitle>
          <CardDescription>
            Your AI-generated schedule will appear here once it's created.
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

  const times = Object.keys(schedule);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-headline text-2xl">
              Generated Timetable
            </CardTitle>
            <CardDescription>
              Review the schedule. If it looks good, publish it to make it
              live.
            </CardDescription>
          </div>
          <Button onClick={() => onPublish(schedule)}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Publish Timetable
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full border-collapse text-center">
            <thead>
              <tr className="bg-muted/40">
                <th className="p-3 font-medium text-muted-foreground w-28">
                  Time
                </th>
                {days.map((day) => (
                  <th
                    key={day}
                    className="p-3 font-medium text-muted-foreground"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {times.map((time) => (
                <tr
                  key={time}
                  className="border-b last:border-b-0"
                >
                  <td className="p-3 font-medium text-muted-foreground bg-muted/20">
                    {time}
                  </td>
                  {days.map((day) => {
                    const cell = schedule[time]?.[day];
                    if (!cell) {
                      return <td key={`${time}-${day}`} className="p-3 border-l"></td>;
                    }
                    const isBreak = cell.subject === "Break";
                    return (
                      <td
                        key={`${time}-${day}`}
                        className={`p-3 border-l ${
                          isBreak
                            ? "bg-amber-100/50 dark:bg-amber-900/30"
                            : ""
                        }`}
                      >
                        {isBreak ? (
                          <span className="font-bold text-amber-600 dark:text-amber-400">
                            Break
                          </span>
                        ) : (
                          <div>
                            <p className="font-semibold text-sm">
                              {cell.subject}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {cell.teacher}
                            </p>
                            {cell.room && (
                              <p className="text-xs text-muted-foreground">
                                {cell.room}
                              </p>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
