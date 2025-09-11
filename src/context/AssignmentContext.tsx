
"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

export interface Assignment {
  id: number;
  title: string;
  course: string;
  dueDate?: string;
  status?: "Due Soon" | "Upcoming" | "Submitted";
  submittedDate?: string;
  grade?: string;
  description?: string;
}

interface AssignmentContextType {
  assignments: Assignment[];
  submittedAssignments: Assignment[];
  addAssignment: (assignment: Omit<Assignment, 'id' | 'status'>) => void;
  submitAssignment: (assignmentId: number, submittedTitle: string) => void;
}

const AssignmentContext = createContext<AssignmentContextType | undefined>(undefined);

const initialUpcomingAssignments: Assignment[] = [
    { id: 1, title: "Problem Set 3", course: "Quantum Physics", dueDate: "in 2 days", status: "Due Soon", description: "Solve problems 1-5 from chapter 3." },
    { id: 2, title: "Essay on Modernism", course: "Literature 201", dueDate: "in 5 days", status: "Upcoming", description: "Write a 5-page essay on the impact of modernism." },
    { id: 3, title: "Lab Report 4", course: "Organic Chemistry", dueDate: "in 1 week", status: "Upcoming", description: "Document the results of the latest experiment." },
];

const initialSubmittedAssignments: Assignment[] = [
    { id: 4, title: "Calculus Midterm", course: "Advanced Calculus", submittedDate: "2 days ago", grade: "A-", status: "Submitted" },
    { id:5, title: "Project Proposal", course: "Data Structures", submittedDate: "5 days ago", grade: "Graded", status: "Submitted" },
    { id: 6, title: "Weekly Quiz 5", course: "Quantum Physics", submittedDate: "1 week ago", grade: "B+", status: "Submitted" },
];


export const AssignmentProvider = ({ children }: { children: ReactNode }) => {
  const [assignments, setAssignments] = useState<Assignment[]>(initialUpcomingAssignments);
  const [submittedAssignments, setSubmittedAssignments] = useState<Assignment[]>(initialSubmittedAssignments);

  const addAssignment = (assignment: Omit<Assignment, 'id' | 'status'>) => {
    const newAssignment: Assignment = {
      id: Date.now(),
      ...assignment,
      status: 'Upcoming',
    };
    setAssignments(prev => [newAssignment, ...prev]);
  };
  
  const submitAssignment = (assignmentId: number, submittedTitle: string) => {
    const assignmentToSubmit = assignments.find(a => a.id === assignmentId);
    if (!assignmentToSubmit) return;

    const newSubmittedAssignment: Assignment = {
      ...assignmentToSubmit,
      title: submittedTitle, 
      submittedDate: "Just now",
      grade: "Pending",
      status: "Submitted",
    };
    
    setSubmittedAssignments(prev => [newSubmittedAssignment, ...prev]);
    setAssignments(prev => prev.filter(a => a.id !== assignmentId));
  }


  return (
    <AssignmentContext.Provider value={{ assignments, submittedAssignments, addAssignment, submitAssignment }}>
      {children}
    </AssignmentContext.Provider>
  );
};

export const useAssignments = () => {
  const context = useContext(AssignmentContext);
  if (context === undefined) {
    throw new Error('useAssignments must be used within an AssignmentProvider');
  }
  return context;
};
