
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BookOpen, User, Star } from "lucide-react";
import Link from "next/link";

const cseCourses = [
  {
    code: "CS101",
    name: "Introduction to Programming",
    teacher: "Dr. Evelyn Reed",
    description: "Learn the fundamentals of programming using Python. Covers variables, control structures, functions, and basic data structures.",
    credits: 4,
  },
  {
    code: "CS102",
    name: "Data Structures and Algorithms",
    teacher: "Prof. Samuel Chen",
    description: "A deep dive into essential data structures like arrays, linked lists, trees, and graphs, along with fundamental algorithms for sorting, searching, and optimization.",
    credits: 4,
  },
  {
    code: "CS201",
    name: "Object-Oriented Programming",
    teacher: "Dr. Maria Garcia",
    description: "Principles of object-oriented design, including classes, inheritance, and polymorphism. Practical application using Java.",
    credits: 3,
  },
  {
    code: "CS205",
    name: "Computer Architecture",
    teacher: "Prof. Ben Carter",
    description: "Understand the structure and function of digital computers, from basic logic gates to modern processor design.",
    credits: 3,
  },
  {
    code: "CS301",
    name: "Database Systems",
    teacher: "Dr. Aisha Khan",
    description: "Covers the design, implementation, and management of database systems. Topics include SQL, relational algebra, and normalization.",
    credits: 3,
  },
  {
    code: "CS320",
    name: "Operating Systems",
    teacher: "Prof. David Miller",
    description: "Explore the core concepts of operating systems, such as process management, memory management, file systems, and concurrency.",
    credits: 3,
  },
  {
    code: "CS401",
    name: "Software Engineering",
    teacher: "Dr. Olivia White",
    description: "Learn the methodologies and practices for designing, developing, and maintaining large-scale software systems.",
    credits: 3,
  },
  {
    code: "CS450",
    name: "Artificial Intelligence",
    teacher: "Prof. Kenji Tanaka",
    description: "An introduction to the field of AI, covering search algorithms, machine learning, neural networks, and natural language processing.",
    credits: 3,
  },
   {
    code: "PSM101",
    name: "Public Speaking Mastery",
    teacher: "Prof. Eleanor Vance",
    description: "Develop confidence and skill in public speaking, from overcoming anxiety to delivering powerful presentations.",
    credits: 2,
  },
];


export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="font-headline text-2xl">Available Courses</CardTitle>
              <CardDescription>An overview of the core curriculum and electives.</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cseCourses.map((course) => (
          <Link 
              href={`/dashboard/courses/${course.code}?name=${encodeURIComponent(course.name)}&code=${encodeURIComponent(course.code)}&description=${encodeURIComponent(course.description)}`} 
              key={course.code}
          >
            <Card className="flex flex-col h-full hover:border-primary transition-all">
              <CardHeader>
                <CardTitle className="text-xl">{course.name}</CardTitle>
                <CardDescription>{course.code}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{course.description}</p>
              </CardContent>
              <CardContent className="flex items-center justify-between text-sm border-t pt-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{course.teacher}</span>
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-primary">
                      <Star className="h-4 w-4" />
                      <span>{course.credits} Credits</span>
                  </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
