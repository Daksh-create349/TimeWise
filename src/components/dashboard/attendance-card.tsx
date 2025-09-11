"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UserCheck } from "lucide-react";
import { useAttendance } from "@/context/AttendanceContext";
import { useTimetable } from "@/context/TimetableContext";
import { useEffect, useState } from "react";

export default function AttendanceCard() {
  const { presentStudents } = useAttendance();
  const { getTodaysSchedule } = useTimetable();

  const [todaysClasses, setTodaysClasses] = useState<any[]>([]);

  useEffect(() => {
    setTodaysClasses(getTodaysSchedule());
  }, [getTodaysSchedule])
  
  const attendanceData = todaysClasses
    .filter(c => c.subject !== "Break")
    .map(c => ({
      subject: c.subject,
      percentage: presentStudents.includes(c.subject) ? 100 : 74, // Mock base attendance
    }));


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="font-headline">Attendance Tracker</CardTitle>
              <CardDescription>Your attendance for today's courses.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {attendanceData.length > 0 ? (
          <div className="space-y-6">
            {attendanceData.map((item) => (
              <div key={item.subject}>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium">{item.subject}</p>
                  <p className={`text-sm font-bold ${item.percentage < 80 ? 'text-destructive' : 'text-foreground'}`}>
                    {item.percentage}%
                  </p>
                </div>
                <Progress value={item.percentage} className="h-2" indicatorClassName={item.percentage < 80 ? 'bg-destructive' : (item.percentage === 100 ? 'bg-green-500' : 'bg-primary')} />
                {item.percentage === 100 && <p className="text-xs text-green-600 mt-1">You are marked present!</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <p>No classes scheduled for today.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
