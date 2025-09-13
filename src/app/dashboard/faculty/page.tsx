
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import UpcomingEventsCard from "@/components/dashboard/faculty/upcoming-events-card";
import { useTimetable } from '@/context/TimetableContext';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import AttendanceTakerDialog from './attendance-taker-dialog';


const scheduleData = [
    { time: "9:00 AM - 11:00 AM", subject: "Mathematics", room: "Room 101", students: 45 },
    { time: "11:00 AM - 1:00 PM", subject: "Advanced Calculus", room: "Room 203", students: 35 },
    { time: "2:00 PM - 4:00 PM", subject: "Statistics", room: "Room 105", students: 38 },
];

export default function FacultyDashboardPage() {
  const { absentClasses } = useTimetable();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedClass, setSelectedClass] = React.useState<{subject: string} | null>(null);

  const openAttendanceTaker = (subject: string) => {
    setSelectedClass({ subject });
    setIsDialogOpen(true);
  }

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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2">
                            <Calendar className="w-6 h-6" /> Today's Schedule & Attendance
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                           Generate a unique question for each class to take attendance.
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {scheduleData.map((item, index) => {
                            const isAbsent = absentClasses.includes(item.subject);

                            return (
                                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                    <div className="flex items-center gap-4">
                                        <div className="font-semibold text-primary w-28">{item.time}</div>
                                        <div>
                                            <p className="font-bold">{item.subject}</p>
                                            <p className="text-sm text-muted-foreground">{item.room} &middot; {item.students} students</p>
                                        </div>
                                    </div>
                                    <DialogTrigger asChild>
                                        <Button 
                                            variant={isAbsent ? "secondary" : "default"}
                                            onClick={() => openAttendanceTaker(item.subject)}
                                        >
                                            <CheckSquare className="mr-2 h-4 w-4" />
                                            Take Attendance
                                        </Button>
                                    </DialogTrigger>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>

                <UpcomingEventsCard />
            </div>
             <DialogContent className="sm:max-w-md">
                {selectedClass && <AttendanceTakerDialog subject={selectedClass.subject} />}
            </DialogContent>
        </Dialog>
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
