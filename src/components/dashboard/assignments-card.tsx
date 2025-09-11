import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, CheckCircle, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import UploadAssignmentDialog from "./upload-assignment-dialog";

const upcomingAssignments = [
    { id: 1, title: "Problem Set 3", course: "Quantum Physics", dueDate: "in 2 days", status: "Due Soon" },
    { id: 2, title: "Essay on Modernism", course: "Literature 201", dueDate: "in 5 days", status: "Upcoming" },
    { id: 3, title: "Lab Report 4", course: "Organic Chemistry", dueDate: "in 1 week", status: "Upcoming" },
];

const submittedAssignments = [
    { id: 1, title: "Calculus Midterm", course: "Advanced Calculus", submittedDate: "2 days ago", grade: "A-" },
    { id: 2, title: "Project Proposal", course: "Data Structures", submittedDate: "5 days ago", grade: "Graded" },
    { id: 3, title: "Weekly Quiz 5", course: "Quantum Physics", submittedDate: "1 week ago", grade: "B+" },
];

export default function AssignmentsCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
         <div className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            <div>
              <CardTitle className="font-headline">Assignments</CardTitle>
              <CardDescription>Your upcoming and submitted work.</CardDescription>
            </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <UploadAssignmentDialog />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upcoming">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="submitted">Submitted</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="mt-4 space-y-4">
            {upcomingAssignments.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/50">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.course}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{item.dueDate}</p>
                  <Badge variant={item.status === 'Due Soon' ? "destructive" : "outline"}>{item.status}</Badge>
                </div>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="submitted" className="mt-4 space-y-4">
            {submittedAssignments.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/50">
                 <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.course}</p>
                </div>
                <div className="text-right flex items-center gap-2">
                   <p className="text-sm text-muted-foreground">{item.submittedDate}</p>
                   <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="mr-1 h-3 w-3" /> {item.grade}
                  </Badge>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
