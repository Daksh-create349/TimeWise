
"use client";

import React from 'react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { Assignment } from '@/context/AssignmentContext';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { addDays, format } from 'date-fns';

interface UploadAssignmentFormProps {
  onAssignmentAdd: (assignment: Omit<Assignment, 'id'>) => void;
}

export default function UploadAssignmentForm({ onAssignmentAdd }: UploadAssignmentFormProps) {
  const [title, setTitle] = React.useState('');
  const [course, setCourse] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [dueDate, setDueDate] = React.useState(format(addDays(new Date(), 7), 'yyyy-MM-dd'));

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!title || !course || !dueDate) {
        toast({
            variant: "destructive",
            title: "Missing fields",
            description: "Please fill out all required fields."
        });
        return;
    }

    setIsSubmitting(true);

    const newAssignment = {
      title,
      course,
      description,
      dueDate: format(new Date(dueDate), "MMM dd, yyyy"),
      status: 'Upcoming',
    };

    setTimeout(() => {
      onAssignmentAdd(newAssignment);
      toast({
        title: 'Assignment Added',
        description: `The assignment "${title}" has been added successfully.`,
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-headline text-2xl">
          Add New Assignment
        </DialogTitle>
        <DialogDescription>
          Fill in the details below to create a new assignment for your
          students.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-6 py-4">
        <div className="space-y-2">
          <Label htmlFor="assignment-title">Assignment Title</Label>
          <Input
            id="assignment-title"
            placeholder="e.g., Quantum Mechanics Problem Set"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Select required value={course} onValueChange={setCourse}>
                    <SelectTrigger id="course">
                    <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Quantum Physics">Quantum Physics</SelectItem>
                        <SelectItem value="Literature 201">Literature 201</SelectItem>
                        <SelectItem value="Organic Chemistry">Organic Chemistry</SelectItem>
                        <SelectItem value="Advanced Calculus">Advanced Calculus</SelectItem>
                        <SelectItem value="Data Structures">Data Structures</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="due-date">Due Date</Label>
                <Input
                    id="due-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                />
            </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Provide a brief description or instructions for the assignment."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <DialogFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
              </>
            ) : (
              'Add Assignment'
            )}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
