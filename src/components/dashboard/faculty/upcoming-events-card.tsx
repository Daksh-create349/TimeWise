
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "lucide-react";
import Link from "next/link";

const events = [
    {
        title: "Faculty Meeting",
        date: "Today, 3:00 PM",
        location: "Conference Room A",
        tag: "Meeting",
        tagVariant: "secondary",
        tagClass: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    },
    {
        title: "Student Orientation",
        date: "Tomorrow, 9:00 AM",
        location: "Main Auditorium",
        tag: "Event",
        tagVariant: "secondary",
        tagClass: "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300 border-green-200 dark:border-green-800",
    },
    {
        title: "Registration Deadline",
        date: "Sept 15, 11:59 PM",
        location: "Online System",
        tag: "Deadline",
        tagVariant: "destructive",
        tagClass: "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 border-red-200 dark:border-red-800",
    },
    {
        title: "Semester Begins",
        date: "Sept 18, 8:00 AM",
        location: "Campus Wide",
        tag: "Academic",
        tagVariant: "secondary",
        tagClass: "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    }
];

export default function UpcomingEventsCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Calendar className="w-6 h-6" /> Upcoming Events
                </CardTitle>
                 <CardDescription>A quick look at what's coming up.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {events.map((event, index) => (
                    <React.Fragment key={event.title}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-bold">{event.title}</p>
                                <p className="text-sm text-muted-foreground">{event.date}</p>
                                <p className="text-sm text-muted-foreground">{event.location}</p>
                            </div>
                            <Badge variant={event.tagVariant as any} className={event.tagClass}>
                                {event.tag}
                            </Badge>
                        </div>
                        {index < events.length - 1 && <Separator />}
                    </React.Fragment>
                ))}
            </CardContent>
            <CardFooter className="border-t pt-4">
                <Link href="#" className="w-full">
                    <Button variant="ghost" className="w-full text-primary hover:text-primary">
                        View Full Calendar
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
