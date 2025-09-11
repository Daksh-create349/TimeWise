
"use client"

import * as React from "react"
import { format, addDays, startOfWeek, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const mockEvents = {
  [format(new Date(), "yyyy-MM-dd")]: [{ title: "Faculty Meeting", color: "bg-blue-500" }],
  [format(addDays(new Date(), 1), "yyyy-MM-dd")]: [{ title: "Student Orientation", color: "bg-green-500" }],
  [format(addDays(new Date(), 5), "yyyy-MM-dd")]: [{ title: "Project Submissions Due", color: "bg-red-500" }],
  [format(addDays(new Date(), 10), "yyyy-MM-dd")]: [{ title: "Mid-term Exams Begin", color: "bg-yellow-500" }],
  [format(addDays(new Date(), -3), "yyyy-MM-dd")]: [{ title: "Guest Lecture", color: "bg-purple-500" }],
};


export default function CalendarPage() {
  const [currentDate, setCurrentDate] = React.useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const days = []
  let day = startDate
  let formattedDate = ""

  while (day <= endDate) {
    formattedDate = format(day, "d")
    const cloneDay = day
    const dayKey = format(cloneDay, "yyyy-MM-dd");
    
    days.push(
      <div
        key={day.toString()}
        className={`col-span-1 h-32 p-2 border-t border-r ${!isSameMonth(day, monthStart) ? "bg-muted/50 text-muted-foreground" : ""
          } ${isSameDay(day, new Date()) ? "bg-primary/10" : ""
          }`}
      >
        <div className={`font-semibold ${isSameDay(day, new Date()) ? "text-primary" : ""}`}>
          {formattedDate}
        </div>
        <div className="mt-1 space-y-1">
          {mockEvents[dayKey]?.map(event => (
             <Badge key={event.title} className={`${event.color} text-white truncate text-xs w-full block`}>
                {event.title}
             </Badge>
          ))}
        </div>
      </div>
    )
    day = addDays(day, 1)
  }

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-headline text-2xl">Full Academic Calendar</CardTitle>
            <CardDescription>View all events, deadlines, and schedules for the month.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold w-32 text-center">{format(currentDate, "MMMM yyyy")}</h2>
            <Button variant="outline" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border-l border-b">
          <div className="grid grid-cols-7">
            {dayNames.map(dayName => (
              <div key={dayName} className="text-center font-medium text-muted-foreground p-2 border-t border-r">{dayName}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
