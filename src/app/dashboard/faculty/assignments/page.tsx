
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, FilePlus, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import UploadAssignmentForm from '@/components/dashboard/faculty/upload-assignment-form';
import { useAssignments } from '@/context/AssignmentContext';
import { Badge } from '@/components/ui/badge';
import { AssignmentProvider } from '@/context/AssignmentContext';

function AssignmentManagementContent() {
  const { assignments, addAssignment } = useAssignments();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Book className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="font-headline text-2xl">Assignment Management</CardTitle>
              <CardDescription>
                Upload and manage assignments for your courses. Students will be
                automatically notified when new assignments are added.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DialogTrigger asChild>
            <Button>
              <FilePlus className="mr-2 h-4 w-4" /> Add Assignment
            </Button>
          </DialogTrigger>

          <div className="mt-8 space-y-4">
            {assignments.length === 0 ? (
              <div className="text-center text-muted-foreground py-16">
                <FileText className="mx-auto h-12 w-12" />
                <p className="mt-4">
                  No assignments uploaded yet. Click "Add Assignment" to upload
                  your first assignment.
                </p>
              </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {assignments.map((assignment) => (
                        <Card key={assignment.id}>
                            <CardHeader>
                                <CardTitle className="text-lg">{assignment.title}</CardTitle>
                                <CardDescription>{assignment.course}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">{assignment.description || "No description provided."}</p>
                                <div className="flex justify-between items-center text-sm">
                                    <Badge variant="outline">Due: {assignment.dueDate}</Badge>
                                    <span className="font-semibold">{assignment.status}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
          </div>
        </CardContent>
      </Card>
      <DialogContent className="sm:max-w-xl">
        <UploadAssignmentForm
          onAssignmentAdd={(newAssignment) => {
            addAssignment(newAssignment);
            setIsDialogOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}


export default function FacultyAssignmentsPage() {
    return (
        <AssignmentProvider>
            <AssignmentManagementContent />
        </AssignmentProvider>
    )
}
