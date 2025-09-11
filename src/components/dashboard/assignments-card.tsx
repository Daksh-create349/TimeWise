"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, CheckCircle, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import UploadAssignmentDialog from "./upload-assignment-dialog";
import { useAssignments } from "@/context/AssignmentContext";
import type { Assignment } from "@/context/AssignmentContext";

export default function AssignmentsCard() {
  const { assignments, submittedAssignments, submitAssignment } = useAssignments();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const handleAssignmentSubmit = (submittedTitle: string) => {
    if (!selectedAssignment) return;

    submitAssignment(selectedAssignment.id, submittedTitle);
    
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
              {assignments.map((item) => (
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
              {assignments.length === 0 && (
                <div className="text-center text-muted-foreground p-4">
                    No upcoming assignments.
                </div>
              )}
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
