
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Printer } from "lucide-react";
import Link from "next/link";
import * as React from "react";


const schedule = {
  "9:00 AM": {
    Monday: { subject: "Mathematics", teacher: "Dr. Smith" },
    Tuesday: { subject: "Physics", teacher: "Prof. Johnson" },
    Wednesday: { subject: "Chemistry", teacher: "Dr. Brown" },
    Thursday: { subject: "English", teacher: "Ms. Davis" },
    Friday: { subject: "Computer Science", teacher: "Prof. Wilson" },
  },
  "10:00 AM": {
    Monday: { subject: "Physics", teacher: "Prof. Johnson" },
    Tuesday: { subject: "Mathematics", teacher: "Dr. Smith" },
    Wednesday: { subject: "English", teacher: "Ms. Davis" },
    Thursday: { subject: "Chemistry", teacher: "Dr. Brown" },
    Friday: { subject: "Biology", teacher: "Dr. Green" },
  },
  "11:00 AM": {
    Monday: { subject: "Chemistry", teacher: "Dr. Brown" },
    Tuesday: { subject: "Biology", teacher: "Dr. Green" },
    Wednesday: { subject: "Mathematics", teacher: "Dr. Smith" },
    Thursday: { subject: "Physics", teacher: "Prof. Johnson" },
    Friday: { subject: "English", teacher: "Ms. Davis" },
  },
  "12:00 PM": {
    Monday: { subject: "Break", teacher: "" },
    Tuesday: { subject: "Break", teacher: "" },
    Wednesday: { subject: "Break", teacher: "" },
    Thursday: { subject: "Break", teacher: "" },
    Friday: { subject: "Break", teacher: "" },
  },
  "1:00 PM": {
    Monday: { subject: "English", teacher: "Ms. Davis" },
    Tuesday: { subject: "Computer Science", teacher: "Prof. Wilson" },
    Wednesday: { subject: "Physics", teacher: "Prof. Johnson" },
    Thursday: { subject: "Biology", teacher: "Dr. Green" },
    Friday: { subject: "Mathematics", teacher: "Dr. Smith" },
  },
  "2:00 PM": {
    Monday: { subject: "Biology", teacher: "Dr. Green" },
    Tuesday: { subject: "Chemistry", teacher: "Dr. Brown" },
    Wednesday: { subject: "Computer Science", teacher: "Prof. Wilson" },
    Thursday: { subject: "Mathematics", teacher: "Dr. Smith" },
    Friday: { subject: "Physics", teacher: "Prof. Johnson" },
  },
  "3:00 PM": {
    Monday: { subject: "Computer Science", teacher: "Prof. Wilson" },
    Tuesday: { subject: "English", teacher: "Ms. Davis" },
    Wednesday: { subject: "Biology", teacher: "Dr. Green" },
    Thursday: { subject: "Computer Science", teacher: "Prof. Wilson" },
    Friday: { subject: "Chemistry", teacher: "Dr. Brown" },
  },
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const times = Object.keys(schedule);

export default function TimetablePage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-2xl">Weekly Timetable</CardTitle>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export to Excel
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-center">
            <thead>
              <tr className="bg-muted/40">
                <th className="p-3 font-medium text-muted-foreground w-28">Time</th>
                {days.map((day) => (
                  <th key={day} className="p-3 font-medium text-muted-foreground">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {times.map((time) => (
                <tr key={time} className="border-b">
                  <td className="p-3 font-medium text-muted-foreground">{time}</td>
                  {days.map((day) => {
                    // @ts-ignore
                    const cell = schedule[time][day];
                    const isBreak = cell.subject === "Break";
                    return (
                      <td key={`${time}-${day}`} className={`p-3 ${isBreak ? 'bg-amber-100 dark:bg-amber-900/50' : ''}`}>
                        {isBreak ? (
                           <span className="font-bold text-amber-600 dark:text-amber-400">Break</span>
                        ) : (
                          <div>
                            <p className="font-semibold">{cell.subject}</p>
                            <p className="text-sm text-muted-foreground">{cell.teacher}</p>
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
        <div className="flex justify-end items-center mt-6 gap-4">
            <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print Schedule
            </Button>
            <Link href="/dashboard/assignments" passHref>
                <Button>View Assignments</Button>
            </Link>
        </div>
      </CardContent>
    </Card>
  );
}
