import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

const schedule = [
  { time: "09:00 - 10:30", subject: "Advanced Calculus", room: "A-301", status: "Ongoing" },
  { time: "11:00 - 12:30", subject: "Quantum Physics", room: "B-105", status: "Upcoming" },
  { time: "14:00 - 15:30", subject: "Data Structures", room: "C-210", status: "Upcoming" },
  { time: "16:00 - 17:00", subject: "University Choir Practice", room: "Auditorium", status: "Upcoming" },
];

export default function TimetableCard() {
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
              <TableHead>Room</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedule.map((item) => (
              <TableRow key={item.subject}>
                <TableCell className="font-medium">{item.time}</TableCell>
                <TableCell>{item.subject}</TableCell>
                <TableCell>{item.room}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={item.status === 'Ongoing' ? "destructive" : "secondary"}>
                    {item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
