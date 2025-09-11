
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Loader2, Package, Check, ClipboardCheck, Percent, BookOpen, Clock, Users, Target, Award, ListTodo } from "lucide-react";
import { generateCourseTopics } from "@/ai/flows/generate-course-topics-flow";
import { generateSyllabus, GenerateSyllabusOutput } from "@/ai/flows/generate-syllabus-flow";
import { generateLessonPlan, GenerateLessonPlanOutput } from "@/ai/flows/generate-lesson-plan-flow";
import { generateCourseContent, GenerateCourseContentOutput } from "@/ai/flows/generate-course-content-flow";
import { generateCourseOutcomes, GenerateCourseOutcomesOutput } from "@/ai/flows/generate-course-outcomes-flow";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

// Reusable Loading/Error states
function LoadingState({ text }: { text: string }) {
    return (
        <div className="flex justify-center items-center h-64 text-muted-foreground">
            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
            <p>{text}</p>
        </div>
    );
}

function ErrorState({ error }: { error: string }) {
    return (
        <div className="flex justify-center items-center h-64 text-destructive">
            <p>Error: {error}</p>
        </div>
    );
}

// 1. Basic Info View
export function BasicInfoView({ course }: { course: { name: string; code: string; description: string } }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-primary" />
                    {course.name}
                </CardTitle>
                <CardDescription>{course.code}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{course.description}</p>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span><span className="font-semibold">Instructor:</span> Prof. Samuel Chen</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span><span className="font-semibold">Credits:</span> 4</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-muted-foreground" />
                        <span><span className="font-semibold">Department:</span> Computer Science</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-muted-foreground" />
                        <span><span className="font-semibold">Prerequisites:</span> CS101</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


// 2. Syllabus View
export function SyllabusView({ courseName }: { courseName: string }) {
    const [syllabus, setSyllabus] = useState<GenerateSyllabusOutput['syllabus'] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSyllabus = async () => {
            setIsLoading(true);
            try {
                const result = await generateSyllabus({ courseTitle: courseName });
                setSyllabus(result.syllabus);
            } catch (e: any) {
                setError(e.message || "Failed to load syllabus.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchSyllabus();
    }, [courseName]);

    if (isLoading) return <Card><CardContent><LoadingState text="AI is generating the syllabus..." /></CardContent></Card>;
    if (error) return <Card><CardContent><ErrorState error={error} /></CardContent></Card>;
    if (!syllabus) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-primary" />
                    Syllabus: {courseName}
                </CardTitle>
                <CardDescription>{syllabus.courseDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><Target className="w-5 h-5 text-primary" />Learning Objectives</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {syllabus.learningObjectives.map((obj, i) => <li key={i}>{obj}</li>)}
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><Percent className="w-5 h-5 text-primary" />Evaluation Criteria</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Component</TableHead>
                                <TableHead className="text-right">Weightage</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {syllabus.evaluationCriteria.map((crit, i) => (
                                <TableRow key={i}>
                                    <TableCell>{crit.component}</TableCell>
                                    <TableCell className="text-right font-semibold">{crit.weightage}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary" />Recommended Textbooks</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {syllabus.recommendedTextbooks.map((book, i) => <li key={i}>{book}</li>)}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}


// 3. Course Topics View
type Topic = { srNo: number; topicName: string; };
const topicColumns: ColumnDef<Topic>[] = [
    { accessorKey: "srNo", header: "Sr. No.", cell: ({ row }) => <div className="text-center">{row.getValue("srNo")}</div> },
    { accessorKey: "topicName", header: "Topic Name" },
];

export function CourseTopicsView({ courseName }: { courseName: string }) {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTopics = async () => {
            setIsLoading(true);
            try {
                const result = await generateCourseTopics({ courseTitle: courseName });
                setTopics(result.topics.map((topic, index) => ({ srNo: index + 1, topicName: topic })));
            } catch (e: any) {
                setError(e.message || "An error occurred while fetching topics.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchTopics();
    }, [courseName]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <ClipboardCheck className="w-6 h-6 text-primary" />
                    Course Topics for {courseName}
                </CardTitle>
                <CardDescription>A detailed list of topics covered in this course.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading && <LoadingState text="AI is generating course topics..." />}
                {error && <ErrorState error={error} />}
                {!isLoading && !error && <DataTable columns={topicColumns} data={topics} />}
            </CardContent>
        </Card>
    );
}

// 4. Lesson Plan View
export function LessonPlanView({ courseName }: { courseName: string }) {
    const [plan, setPlan] = useState<GenerateLessonPlanOutput['lessonPlan'] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlan = async () => {
            setIsLoading(true);
            try {
                const result = await generateLessonPlan({ courseTitle: courseName });
                setPlan(result.lessonPlan);
            } catch (e: any) {
                setError(e.message || "Failed to load lesson plan.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPlan();
    }, [courseName]);

    if (isLoading) return <Card><CardContent><LoadingState text="AI is generating the lesson plan..." /></CardContent></Card>;
    if (error) return <Card><CardContent><ErrorState error={error} /></CardContent></Card>;
    if (!plan) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <ListTodo className="w-6 h-6 text-primary" />
                    Lesson Plan: {courseName}
                </CardTitle>
                <CardDescription>A week-by-week breakdown of the course structure.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-1/4">Week</TableHead>
                            <TableHead>Topics</TableHead>
                            <TableHead className="w-1/3">Activities & Assignments</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {plan.map((item, i) => (
                            <TableRow key={i}>
                                <TableCell className="font-semibold">{item.week}</TableCell>
                                <TableCell>{item.topics}</TableCell>
                                <TableCell className="text-muted-foreground">{item.activities}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

// 5. Course Content View
export function CourseContentView({ courseName }: { courseName: string }) {
    const [contents, setContents] = useState<GenerateCourseContentOutput['courseContents'] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            setIsLoading(true);
            try {
                const result = await generateCourseContent({ courseTitle: courseName });
                setContents(result.courseContents);
            } catch (e: any) {
                setError(e.message || "Failed to load course content.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchContent();
    }, [courseName]);
    
    if (isLoading) return <Card><CardContent><LoadingState text="AI is generating course content..." /></CardContent></Card>;
    if (error) return <Card><CardContent><ErrorState error={error} /></CardContent></Card>;
    if (!contents) return null;

    return (
         <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <Package className="w-6 h-6 text-primary" />
                    Course Content for {courseName}
                </CardTitle>
                <CardDescription>AI-generated sample content for this course.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible defaultValue="item-0">
                    {contents.map((item, i) => (
                         <AccordionItem value={`item-${i}`} key={i}>
                            <AccordionTrigger className="text-lg font-semibold">{item.title}</AccordionTrigger>
                            <AccordionContent className="prose prose-sm dark:prose-invert max-w-none">
                                <Badge>{item.contentType}</Badge>
                                <pre className="whitespace-pre-wrap font-sans mt-4 bg-transparent p-0">{item.content}</pre>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
}

// 6. Assignments View
export function AssignmentsView({ courseName }: { courseName: string }) {
    const assignments = [
        { id: 1, title: 'Problem Set 1', dueDate: '2024-09-15', status: 'Graded', grade: 'A-' },
        { id: 2, title: 'Midterm Project Proposal', dueDate: '2024-10-01', status: 'Upcoming' },
        { id: 3, title: 'Research Paper Outline', dueDate: '2024-10-20', status: 'Upcoming' },
    ];
    return (
        <Card>
            <CardHeader>
                 <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <ClipboardCheck className="w-6 h-6 text-primary" />
                    Assignments for {courseName}
                </CardTitle>
                <CardDescription>An overview of coursework and deadlines.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {assignments.map(item => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.title}</TableCell>
                                <TableCell>{item.dueDate}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={item.status === 'Graded' ? 'secondary' : 'default'}>{item.status === 'Graded' ? item.grade : item.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

// 7. Attendance View
export function AttendanceView({ courseName }: { courseName: string }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <Check className="w-6 h-6 text-primary" />
                    Attendance for {courseName}
                </CardTitle>
                <CardDescription>Your attendance record for this course.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-center">
                    <p className="text-6xl font-bold text-primary">92%</p>
                    <p className="text-muted-foreground">Overall Attendance</p>
                </div>
                <Progress value={92} />
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <p className="font-bold text-lg">23</p>
                        <p className="text-sm text-muted-foreground">Classes Attended</p>
                    </div>
                     <div>
                        <p className="font-bold text-lg">2</p>
                        <p className="text-sm text-muted-foreground">Classes Missed</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// 8. Outcomes View
export function CourseOutcomesView({ courseName, isProgramOutcomes }: { courseName: string, isProgramOutcomes?: boolean }) {
    const [outcomes, setOutcomes] = useState<GenerateCourseOutcomesOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOutcomes = async () => {
            setIsLoading(true);
            try {
                const result = await generateCourseOutcomes({ courseTitle: courseName });
                setOutcomes(result);
            } catch (e: any) {
                setError(e.message || "Failed to load outcomes.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchOutcomes();
    }, [courseName]);
    
    if (isLoading) return <Card><CardContent><LoadingState text="AI is generating outcomes..." /></CardContent></Card>;
    if (error) return <Card><CardContent><ErrorState error={error} /></CardContent></Card>;
    if (!outcomes) return null;

    const data = isProgramOutcomes ? outcomes.programOutcomes : outcomes.courseOutcomes;
    const title = isProgramOutcomes ? "Program Outcomes (POs)" : "Course Outcomes (COs)";
    const description = isProgramOutcomes 
        ? "How this course contributes to broader program-level goals."
        : "What you will be able to do upon successful completion of this course.";
    const Icon = isProgramOutcomes ? Target : Award;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <Icon className="w-6 h-6 text-primary" />
                    {title}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-24">ID</TableHead>
                            <TableHead>Description</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map(item => (
                            <TableRow key={item.id}>
                                <TableCell className="font-semibold">{item.id}</TableCell>
                                <TableCell className="text-muted-foreground">{item.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
