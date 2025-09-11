
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import type { BatchTimetables, Schedule } from "@/context/TimetableContext";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

interface TimetableTabsProps {
  schedules: BatchTimetables;
  onPublish: (batchName: string, schedule: Schedule) => void;
}

export default function TimetableTabs({ schedules, onPublish }: TimetableTabsProps) {
  const batchNames = Object.keys(schedules);
  const defaultTab = batchNames[0] || "";

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        {batchNames.map((batchName) => (
          <TabsTrigger key={batchName} value={batchName}>
            {batchName}
          </TabsTrigger>
        ))}
      </TabsList>
      {batchNames.map((batchName) => (
        <TabsContent key={batchName} value={batchName}>
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-headline text-2xl">
                    Timetable for {batchName}
                  </CardTitle>
                  <CardDescription>
                    Review the schedule. If it looks good, publish it to make it
                    live.
                  </CardDescription>
                </div>
                <Button onClick={() => onPublish(batchName, schedules[batchName])}>
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
                    {Object.keys(schedules[batchName]).map((time) => (
                      <tr
                        key={time}
                        className="border-b last:border-b-0"
                      >
                        <td className="p-3 font-medium text-muted-foreground bg-muted/20">
                          {time}
                        </td>
                        {days.map((day) => {
                          const cell = schedules[batchName][time]?.[day];
                          if (!cell) {
                            return <td key={`${time}-${day}`} className="p-3"></td>;
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
        </TabsContent>
      ))}
    </Tabs>
  );
}
