
"use client";

import { useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Home, User, GraduationCap, Calendar, BookOpen, BarChart2, Edit } from "lucide-react";

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || "Alex Johnson";
  const studentId = "CS2023001";
  const email = name.toLowerCase().replace(/\s/g, '.') + "@university.edu";

  const studentProfile = {
    personalInfo: {
      name: name,
      studentId: studentId,
      email: email,
      phone: "+1 (555) 123-4567",
      address: "123 University Lane, Scholarsville, 12345",
    },
    academicInfo: {
      program: "B.Tech in Computer Science & Engineering",
      batch: "2023-2027",
      currentSemester: 3,
      cgpa: "8.75 / 10.0",
    },
    enrolledCourses: [
      { code: "CS201", name: "Data Structures" },
      { code: "MA201", name: "Advanced Calculus" },
      { code: "PH201", name: "Quantum Physics" },
      { code: "HU201", name: "Professional Communication" },
    ],
  };

  const { personalInfo, academicInfo, enrolledCourses } = studentProfile;

  return (
    <div className="space-y-6">
       <Card>
          <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle className="font-headline text-2xl">Student Profile</CardTitle>
                <CardDescription>Your personal and academic dashboard.</CardDescription>
              </div>
              <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4"/>
                  Edit Profile
              </Button>
          </CardHeader>
      </Card>
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column */}
        <div className="md:col-span-1 space-y-6">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Avatar className="h-28 w-28 mx-auto mb-4 border-4 border-primary/50">
                <AvatarImage src={`https://picsum.photos/seed/${personalInfo.name}/200/200`} alt={personalInfo.name} data-ai-hint="student avatar" />
                <AvatarFallback>{personalInfo.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold font-headline">{personalInfo.name}</h2>
              <p className="text-muted-foreground">{personalInfo.studentId}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-primary" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <InfoItem icon={<Mail className="h-4 w-4"/>} label="Email" value={personalInfo.email} />
                <InfoItem icon={<Phone className="h-4 w-4"/>} label="Phone" value={personalInfo.phone} />
                <InfoItem icon={<Home className="h-4 w-4"/>} label="Address" value={personalInfo.address} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="md:col-span-2 space-y-6">
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <GraduationCap className="h-5 w-5 text-primary" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <InfoItem icon={<GraduationCap className="h-4 w-4"/>} label="Program" value={academicInfo.program} />
                    <InfoItem icon={<Calendar className="h-4 w-4"/>} label="Batch" value={academicInfo.batch} />
                    <InfoItem icon={<BookOpen className="h-4 w-4"/>} label="Current Semester" value={academicInfo.currentSemester.toString()} />
                    <InfoItem icon={<BarChart2 className="h-4 w-4"/>} label="CGPA" value={academicInfo.cgpa} />
                </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5 text-primary" />
                Currently Enrolled Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    {enrolledCourses.map(course => (
                        <li key={course.code} className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
                            <span className="font-semibold">{course.name}</span>
                            <span className="text-sm text-muted-foreground font-mono">{course.code}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div>
            <p className="text-xs text-muted-foreground flex items-center gap-2 mb-1">
                {icon} {label}
            </p>
            <p className="font-medium">{value}</p>
        </div>
    )
}
