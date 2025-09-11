
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Home, Calendar, GraduationCap, Clock } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import TrophyIcon from '@/components/trophy-icon';

const facultyProfile = {
    name: "Dr. Evelyn Reed",
    title: "Associate Professor",
    department: "English Literature Department",
    researchArea: "Applied English Literature & Research",
    email: "evelyn.reed@university.edu",
    phone: "+1 (555) 123-4567",
    office: "English Literature Building, Room 205",
    since: "Since August 2018",
    avatarUrl: "https://picsum.photos/seed/faculty1/200/200",
    education: [
        { degree: "Ph.D. in Mathematics", university: "Stanford University", year: "2015" },
        { degree: "M.S. in Applied Mathematics", university: "MIT", year: "2012" },
        { degree: "B.S. in Mathematics", university: "UC Berkeley", year: "2010" },
    ],
    achievements: [
        "Outstanding Teaching Award 2023",
        "Research Excellence Grant Recipient",
        "Published 15+ peer-reviewed papers",
        "Department Head Committee Member",
    ],
    semesterStats: [
        { label: "Total Students", value: "143", color: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300" },
        { label: "Courses Teaching", value: "4", color: "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300" },
        { label: "Attendance Rate", value: "94%", color: "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400" },
    ]
};

export default function FacultyProfilePage() {
    return (
        <div className="space-y-6">
            <Link href="/dashboard/faculty" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardContent className="pt-6">
                           <div className="flex flex-col sm:flex-row items-center gap-6">
                                <Avatar className="w-28 h-28">
                                    <AvatarImage src={facultyProfile.avatarUrl} alt={facultyProfile.name} data-ai-hint="female professor" />
                                    <AvatarFallback>{facultyProfile.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                </Avatar>
                                <div className="text-center sm:text-left">
                                    <h1 className="text-3xl font-bold font-headline">{facultyProfile.name}</h1>
                                    <p className="text-lg text-muted-foreground">{facultyProfile.title}</p>
                                    <Badge variant="secondary" className="mt-2">{facultyProfile.department}</Badge>
                                    <p className="text-sm text-muted-foreground mt-2">{facultyProfile.researchArea}</p>
                                </div>
                           </div>
                           <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground border-t pt-4">
                                <InfoRow icon={<Mail className="w-4 h-4"/>} text={facultyProfile.email} />
                                <InfoRow icon={<Phone className="w-4 h-4"/>} text={facultyProfile.phone} />
                                <InfoRow icon={<Home className="w-4 h-4"/>} text={facultyProfile.office} />
                                <InfoRow icon={<Calendar className="w-4 h-4"/>} text={facultyProfile.since} />
                           </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 font-headline text-xl">
                                    <GraduationCap className="w-5 h-5 text-primary" />
                                    Education
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {facultyProfile.education.map(edu => (
                                    <div key={edu.degree}>
                                        <p className="font-semibold">{edu.degree}</p>
                                        <p className="text-sm text-muted-foreground">{edu.university}</p>
                                        <p className="text-xs text-muted-foreground">{edu.year}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 font-headline text-xl">
                                    <TrophyIcon className="w-5 h-5 text-primary" />
                                    Achievements & Recognition
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 list-disc list-inside text-sm text-muted-foreground">
                                    {facultyProfile.achievements.map(ach => (
                                        <li key={ach}>{ach}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline text-xl">
                                <Clock className="w-5 h-5 text-primary" />
                                Current Semester
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {facultyProfile.semesterStats.map(stat => (
                                <div key={stat.label} className={`p-4 rounded-lg flex flex-col items-center justify-center text-center ${stat.color}`}>
                                    <div className="text-3xl font-bold">{stat.value}</div>
                                    <div className="text-sm font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function InfoRow({ icon, text }: { icon: React.ReactNode, text: string }) {
    return (
        <div className="flex items-center gap-3">
            {icon}
            <span className="break-all">{text}</span>
        </div>
    )
}
