
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BookOpen, Briefcase, Calendar, Clock, GraduationCap, Mail, Phone, Users } from "lucide-react";

const facultyProfile = {
    name: "Dr. Evelyn Reed",
    title: "Associate Professor",
    department: "Engineering",
    email: "evelyn.reed@university.edu",
    researchArea: "Applied Engineering & Research",
    since: "Since August 2018",
    employeeId: "EMP-CS-001",
    office: "Engineering Building, Room 205",
    phone: "+1 (555) 123-4567",
    avatar: "https://picsum.photos/seed/faculty1/200/200"
};

const overviewStats = [
    { label: "Classes Today", value: "4", icon: BookOpen, color: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300" },
    { label: "Total Students", value: "143", icon: Users, color: "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300" },
    { label: "Teaching Hours", value: "6h", icon: Clock, color: "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400" },
    { label: "Office Hours", value: "2", icon: Briefcase, color: "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400" },
];

const schedule = [
    { time: "9:00 AM", subject: "Mathematics", room: "Room 101", students: 45 },
    { time: "11:00 AM", subject: "Advanced Calculus", room: "Room 203", students: 35 },
    { time: "2:00 PM", subject: "Statistics", room: "Room 105", students: 38 },
];

export default function FacultyDashboardPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column */}
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={facultyProfile.avatar} alt={facultyProfile.name} data-ai-hint="female professor" />
              <AvatarFallback>{facultyProfile.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold font-headline">{facultyProfile.name}</h2>
            <p className="text-muted-foreground">{facultyProfile.title}</p>
            <Badge variant="secondary" className="mt-2">{facultyProfile.department}</Badge>
          </CardContent>
          <CardContent className="text-sm text-muted-foreground space-y-4">
            <InfoRow icon={Mail} text={facultyProfile.email} />
            <InfoRow icon={GraduationCap} text={facultyProfile.researchArea} />
            <InfoRow icon={Calendar} text={facultyProfile.since} />
            <div className="border-t pt-4 mt-4">
                <p><span className="font-medium text-foreground">Employee ID:</span> {facultyProfile.employeeId}</p>
                <p><span className="font-medium text-foreground">Office:</span> {facultyProfile.office}</p>
                <p><span className="font-medium text-foreground">Phone:</span> {facultyProfile.phone}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right column */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Clock className="w-6 h-6" /> Today's Overview
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {overviewStats.map(stat => (
                    <div key={stat.label} className={`p-4 rounded-lg flex flex-col items-center justify-center text-center ${stat.color}`}>
                        <div className="text-3xl font-bold">{stat.value}</div>
                        <div className="text-sm font-medium">{stat.label}</div>
                    </div>
                ))}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Calendar className="w-6 h-6" /> Today's Schedule & Attendance
                </CardTitle>
                 <p className="text-sm text-muted-foreground">
                    Toggle your availability for each class. Marking absent will notify students and prompt you to send a leave request.
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                {schedule.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-4">
                            <div className="font-semibold text-primary w-20">{item.time}</div>
                            <div>
                                <p className="font-bold">{item.subject}</p>
                                <p className="text-sm text-muted-foreground">{item.room} &middot; {item.students} students</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Label htmlFor={`attendance-${index}`} className="text-sm font-medium text-green-600">Present</Label>
                            <Switch id={`attendance-${index}`} defaultChecked/>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, text }: { icon: React.ElementType, text: string }) {
    return (
        <div className="flex items-center gap-3">
            <Icon className="w-4 h-4" />
            <span>{text}</span>
        </div>
    )
}
