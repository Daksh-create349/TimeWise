
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, UserCheck } from "lucide-react";
import { useTimetable } from "@/context/TimetableContext";
import { useEffect, useState } from "react";

export default function TimetableCard() {
  const { getTodaysSchedule } = useTimetable();
  const [schedule, setSchedule] = useState<any[]>([]);

  useEffect(() => {
    setSchedule(getTodaysSchedule());
  }, [getTodaysSchedule]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          <div>
            <CardTitle className="font-headline">Today's Schedule</CardTitle>
            <CardDescription>Your classes and events for today.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Faculty</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedule.map((item) => (
              <TableRow key={`${item.time}-${item.subject}`}>
                <TableCell className="font-medium">{item.time}</TableCell>
                <TableCell>{item.subject}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {item.teacher}
                    {item.isProxy && (
                      <Badge variant="outline" className="text-xs text-blue-600 border-blue-600/30 bg-blue-500/10">
                        <UserCheck className="w-3 h-3 mr-1" />
                        Proxy
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={item.status === 'Ongoing' ? "destructive" : "secondary"}>
                    {item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
             {schedule.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        No classes scheduled for today.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
