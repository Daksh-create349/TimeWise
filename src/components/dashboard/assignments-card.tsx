"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, CheckCircle, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import UploadAssignmentDialog from "./upload-assignment-dialog";

const initialUpcomingAssignments = [
    { id: 1, title: "Problem Set 3", course: "Quantum Physics", dueDate: "in 2 days", status: "Due Soon" },
    { id: 2, title: "Essay on Modernism", course: "Literature 201", dueDate: "in 5 days", status: "Upcoming" },
    { id: 3, title: "Lab Report 4", course: "Organic Chemistry", dueDate: "in 1 week", status: "Upcoming" },
];

const initialSubmittedAssignments = [
    { id: 4, title: "Calculus Midterm", course: "Advanced Calculus", submittedDate: "2 days ago", grade: "A-" },
    { id: 5, title: "Project Proposal", course: "Data Structures", submittedDate: "5 days ago", grade: "Graded" },
    { id: 6, title: "Weekly Quiz 5", course: "Quantum Physics", submittedDate: "1 week ago", grade: "B+" },
];

interface Assignment {
  id: number;
  title: string;
  course: string;
  dueDate?: string;
  status?: string;
  submittedDate?: string;
  grade?: string;
}

export default function AssignmentsCard() {
  const [upcomingAssignments, setUpcomingAssignments] = useState<Assignment[]>(initialUpcomingAssignments);
  const [submittedAssignments, setSubmittedAssignments] = useState<Assignment[]>(initialSubmittedAssignments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const handleAssignmentSubmit = (submittedTitle: string) => {
    if (!selectedAssignment) return;

    const newSubmittedAssignment: Assignment = {
      ...selectedAssignment,
      title: submittedTitle, 
      submittedDate: "Just now",
      grade: "Pending",
    };

    setSubmittedAssignments(prev => [newSubmittedAssignment, ...prev]);
    setUpcomingAssignments(prev => prev.filter(a => a.id !== selectedAssignment.id));
    
    setIsDialogOpen(false);
    setSelectedAssignment(null);
  };
  
  const openDialogForAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsDialogOpen(true);
  }

  return (
    <Card>
      <CardHeader>
         <div className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            <div>
              <CardTitle className="font-headline">Assignments</CardTitle>
              <CardDescription>Your upcoming and submitted work.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
          setIsDialogOpen(isOpen);
          if (!isOpen) {
            setSelectedAssignment(null);
          }
        }}>
          <Tabs defaultValue="upcoming">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="submitted">Submitted</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="mt-4 space-y-2">
              {upcomingAssignments.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-md hover:bg-secondary/50">
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.course}</p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="text-sm font-medium">{item.dueDate}</p>
                      <Badge variant={item.status === 'Due Soon' ? "destructive" : "outline"}>{item.status}</Badge>
                    </div>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => openDialogForAssignment(item)}>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload
                      </Button>
                    </DialogTrigger>
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
                     <Badge variant={item.grade === 'Pending' ? 'secondary' : 'default'} className={item.grade !== 'Pending' ? 'bg-green-600 hover:bg-green-700' : ''}>
                      {item.grade !== 'Pending' && <CheckCircle className="mr-1 h-3 w-3" />} {item.grade}
                    </Badge>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
           <DialogContent className="sm:max-w-md">
              <UploadAssignmentDialog
                key={selectedAssignment?.id}
                assignmentName={selectedAssignment?.title || ""}
                onAssignmentSubmit={handleAssignmentSubmit}
              />
            </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
