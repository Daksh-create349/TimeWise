import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UserCheck } from "lucide-react";

const attendanceData = [
  { subject: "Advanced Calculus", percentage: 95 },
  { subject: "Quantum Physics", percentage: 88 },
  { subject: "Data Structures", percentage: 100 },
  { subject: "Literature 201", percentage: 74 },
];

export default function AttendanceCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="font-headline">Attendance Tracker</CardTitle>
              <CardDescription>Your attendance for current courses.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {attendanceData.map((item) => (
            <div key={item.subject}>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium">{item.subject}</p>
                <p className={`text-sm font-bold ${item.percentage < 80 ? 'text-destructive' : 'text-foreground'}`}>
                  {item.percentage}%
                </p>
              </div>
              <Progress value={item.percentage} className="h-2" indicatorClassName={item.percentage < 80 ? 'bg-destructive' : 'bg-primary'} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Custom indicator class for Progress
const progressIndicatorVariants = (percentage: number) => {
    if (percentage < 75) return 'bg-destructive';
    if (percentage < 90) return 'bg-yellow-500';
    return 'bg-green-500';
}
