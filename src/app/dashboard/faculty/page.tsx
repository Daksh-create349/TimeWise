
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import UpcomingEventsCard from "@/components/dashboard/faculty/upcoming-events-card";
import { useTimetable } from '@/context/TimetableContext';
import { useToast } from '@/hooks/use-toast';

const scheduleData = [
    { time: "9:00 AM - 11:00 AM", subject: "Mathematics", room: "Room 101", students: 45 },
    { time: "11:00 AM - 1:00 PM", subject: "Advanced Calculus", room: "Room 203", students: 35 },
    { time: "2:00 PM - 4:00 PM", subject: "Statistics", room: "Room 105", students: 38 },
];

export default function FacultyDashboardPage() {
  const { absentClasses, toggleAbsence } = useTimetable();
  const { toast } = useToast();

  const handleAttendanceChange = (checked: boolean, subject: string) => {
    const isAbsent = !checked;
    toggleAbsence(subject);

    if (isAbsent) {
      toast({
        title: "Notification Sent",
        description: `Students in ${subject} have been notified of your absence.`,
      });
    }
  };

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center justify-between">
                    Today's Overview
                    <Link href="/dashboard/faculty/profile" passHref>
                        <Button variant="outline">View Profile</Button>
                    </Link>
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Classes Today" value="3" />
                <StatCard label="Total Students" value="118" />
                <StatCard label="Teaching Hours" value="6h" />
                <StatCard label="Office Hours" value="2" />
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <Calendar className="w-6 h-6" /> Today's Schedule & Attendance
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Toggle your availability for each class. Marking absent will notify students.
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    {scheduleData.map((item, index) => {
                        const isAbsent = absentClasses.includes(item.subject);
                        const isPresent = !isAbsent;

                        return (
                            <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                <div className="flex items-center gap-4">
                                    <div className="font-semibold text-primary w-28">{item.time}</div>
                                    <div>
                                        <p className="font-bold">{item.subject}</p>
                                        <p className="text-sm text-muted-foreground">{item.room} &middot; {item.students} students</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor={`attendance-${index}`} className={`text-sm font-medium ${isPresent ? 'text-green-600' : 'text-red-600'}`}>
                                        {isPresent ? 'Present' : 'Absent'}
                                    </Label>
                                    <Switch 
                                        id={`attendance-${index}`} 
                                        checked={isPresent}
                                        onCheckedChange={(checked) => handleAttendanceChange(checked, item.subject)}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </CardContent>
            </Card>

            <UpcomingEventsCard />
        </div>
      </div>
  );
}


function StatCard({ label, value }: { label: string, value: string }) {
    return (
        <div className="p-4 rounded-lg bg-primary/10 text-center">
            <div className="text-3xl font-bold text-primary">{value}</div>
            <div className="text-sm font-medium text-muted-foreground">{label}</div>
        </div>
    )
}
