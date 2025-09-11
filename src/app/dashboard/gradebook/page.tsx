
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BookCheck, Star, FileText, Beaker, MessageSquare } from "lucide-react";

const gradeData = [
  {
    course: "Quantum Physics",
    courseCode: "PH201",
    assignments: [
      { title: "Problem Set 1", type: "Homework", grade: "A-", feedback: "Excellent work, especially on the Schrödinger equation problems." },
      { title: "Midterm Exam", type: "Exam", grade: "B+", feedback: "Good understanding of wave-particle duality, but review quantum tunneling." },
      { title: "Lab Report 2", type: "Lab", grade: "A", feedback: "Perfectly executed experiment and well-documented results." },
    ],
  },
  {
    course: "Advanced Calculus",
    courseCode: "MA201",
    assignments: [
      { title: "Weekly Quiz 1", type: "Quiz", grade: "9/10", feedback: "Great job!" },
      { title: "Weekly Quiz 2", type: "Quiz", grade: "7/10", feedback: "Review theorems on series convergence." },
      { title: "Homework 3", type: "Homework", grade: "B", feedback: "All problems were solved correctly, but show more of your work." },
    ],
  },
  {
    course: "Data Structures",
    courseCode: "CS201",
    assignments: [
      { title: "Project Proposal", type: "Project", grade: "Approved", feedback: "Ambitious but well-thought-out. Looking forward to seeing the result." },
      { title: "Implementation 1", type: "Project", grade: "In Progress", feedback: "Remember to handle edge cases for the tree traversal." },
    ],
  },
];

const iconMap = {
  Homework: <FileText className="h-4 w-4" />,
  Exam: <Star className="h-4 w-4" />,
  Lab: <Beaker className="h-4 w-4" />,
  Quiz: <FileText className="h-4 w-4" />,
  Project: <FileText className="h-4 w-4" />,
};

export default function GradebookPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <BookCheck className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="font-headline text-2xl">Detailed Gradebook</CardTitle>
              <CardDescription>
                An overview of your academic performance and instructor feedback.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {gradeData.map((course) => (
        <Card key={course.courseCode}>
          <CardHeader>
            <CardTitle className="text-xl">{course.course}</CardTitle>
            <CardDescription>{course.courseCode}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Assignment</TableHead>
                  <TableHead className="w-[15%]">Type</TableHead>
                  <TableHead className="w-[15%]">Grade</TableHead>
                  <TableHead>Feedback</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {course.assignments.map((assignment, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{assignment.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {/* @ts-ignore */}
                        {iconMap[assignment.type] || <FileText className="h-4 w-4" />}
                        <span>{assignment.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={assignment.grade.startsWith("A") ? "secondary" : "outline"}
                        className={assignment.grade.startsWith("A") ? 'bg-green-600/10 text-green-700 border-green-600/20' : ''}
                      >
                        {assignment.grade}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground italic">
                      {assignment.feedback}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
