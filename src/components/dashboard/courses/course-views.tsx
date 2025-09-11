
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Loader2, Package, Check, ClipboardCheck, Percent, BookOpen, Clock, Users, Target, Award, ListTodo, Sparkles } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import TopicSuggestionsDialog from "./topic-suggestions-dialog";
import { generateTopicSuggestions, GenerateTopicSuggestionsOutput } from "@/ai/flows/generate-topic-suggestions-flow";


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

export function CourseTopicsView({ courseName }: { courseName: string }) {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<GenerateTopicSuggestionsOutput | null>(null);
    const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
    const [suggestionError, setSuggestionError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTopics = async () => {
            setIsLoading(true);
            try {
                const result = await generateCourseTopics({ courseTitle: courseName });
                setTopics(result.topics.map((topic, index) => ({ srNo: index + 1, topicName: topic })));
            } catch (e: any) {
                setError(e.message || "Failed to load topics.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchTopics();
    }, [courseName]);

    const handleGetSuggestions = async (topicName: string) => {
        setSelectedTopic(topicName);
        setIsDialogOpen(true);
        setIsSuggestionsLoading(true);
        setSuggestions(null);
        setSuggestionError(null);
        try {
            const result = await generateTopicSuggestions({ courseTitle: courseName, topic: topicName });
            setSuggestions(result);
        } catch (e: any) {
            setSuggestionError(e.message || "Failed to load suggestions.");
        } finally {
            setIsSuggestionsLoading(false);
        }
    };

    const columns: ColumnDef<Topic>[] = [
        { accessorKey: "srNo", header: "Sr. No.", cell: ({ row }) => <div className="text-center">{row.getValue("srNo")}</div>, size: 50 },
        { accessorKey: "topicName", header: "Topic Name" },
        {
            id: "actions",
            header: () => <div className="text-center">AI Actions</div>,
            cell: ({ row }) => {
                const topic = row.original;
                return (
                    <div className="text-center">
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleGetSuggestions(topic.topicName)}>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Get Suggestions
                            </Button>
                        </DialogTrigger>
                    </div>
                );
            },
            size: 150,
        },
    ];

    if (isLoading) return <Card><CardContent><LoadingState text="AI is generating course topics..." /></CardContent></Card>;
    if (error) return <Card><CardContent><ErrorState error={error} /></CardContent></Card>;

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2">
                        <ListTodo className="w-6 h-6 text-primary" />
                        Course Topics
                    </CardTitle>
                    <CardDescription>A list of topics covered in {courseName}. Use the AI assistant to get learning resources.</CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={topics} />
                </CardContent>
            </Card>
            <DialogContent className="sm:max-w-3xl">
                <TopicSuggestionsDialog 
                    topicName={selectedTopic || ""} 
                    suggestions={suggestions}
                    isLoading={isSuggestionsLoading}
                    error={suggestionError}
                />
            </DialogContent>
        </Dialog>
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
                <CardDescription>A week-by-week breakdown of topics and activities for the semester.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {plan.map((item, index) => (
                         <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="text-lg font-semibold">{item.week}</AccordionTrigger>
                            <AccordionContent className="space-y-4 pl-2">
                               <div>
                                    <h4 className="font-semibold text-base mb-1">Topics to be Covered:</h4>
                                    <p className="text-muted-foreground">{item.topics}</p>
                               </div>
                               <div>
                                    <h4 className="font-semibold text-base mb-1">Activities & Assignments:</h4>
                                    <p className="text-muted-foreground">{item.activities}</p>
                               </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
}


// 5. Course Content View
export function CourseContentView({ courseName }: { courseName: string }) {
    const [content, setContent] = useState<GenerateCourseContentOutput['courseContents'] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            setIsLoading(true);
            try {
                const result = await generateCourseContent({ courseTitle: courseName });
                setContent(result.courseContents);
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
    if (!content) return null;

    return (
         <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <Package className="w-6 h-6 text-primary" />
                    Course Content
                </CardTitle>
                <CardDescription>AI-generated content to get you started with {courseName}.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {content.map((item, index) => (
                         <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="text-lg font-semibold">{item.title}</AccordionTrigger>
                            <AccordionContent className="space-y-4 pl-2 prose prose-sm dark:prose-invert max-w-none">
                               <Badge>{item.contentType}</Badge>
                               <div dangerouslySetInnerHTML={{ __html: item.content.replace(/\\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
}

// 6. Assignments View
const assignmentsData = [
  { id: 1, title: 'Problem Set 1: Kinematics', dueDate: '2024-09-15', status: 'Graded', score: '95/100' },
  { id: 2, title: 'Lab Report: Free Fall Experiment', dueDate: '2024-09-22', status: 'Graded', score: '88/100' },
  { id: 3, title: 'Midterm Exam 1', dueDate: '2024-10-10', status: 'Upcoming', score: '-' },
  { id: 4, title: 'Problem Set 2: Dynamics', dueDate: '2024-10-20', status: 'Upcoming', score: '-' },
];
export function AssignmentsView({ courseName }: { courseName: string }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <ClipboardCheck className="w-6 h-6 text-primary" />
                    Assignments
                </CardTitle>
                <CardDescription>Assignments and assessments for {courseName}.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {assignmentsData.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.title}</TableCell>
                                <TableCell>{item.dueDate}</TableCell>
                                <TableCell>
                                    <Badge variant={item.status === 'Graded' ? 'secondary' : 'outline'} className={item.status === 'Graded' ? 'bg-green-100 dark:bg-green-900/50' : ''}>{item.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right font-mono">{item.score}</TableCell>
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
    const attendancePercentage = 92; // Mock data
    return (
         <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <Check className="w-6 h-6 text-primary" />
                    Attendance
                </CardTitle>
                <CardDescription>Your attendance record for {courseName}.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center gap-4 pt-8">
                <div className="relative h-32 w-32">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                            className="text-muted/50"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                        />
                        <path
                            className="text-primary"
                            strokeDasharray={`${attendancePercentage}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold">{attendancePercentage}%</span>
                    </div>
                </div>
                <p className="text-muted-foreground">Overall attendance is in good standing.</p>
                <Progress value={attendancePercentage} className="w-full" />
            </CardContent>
        </Card>
    );
}

// 8. Outcomes View (COs and POs)
export function CourseOutcomesView({ courseName, isProgramOutcomes = false }: { courseName: string, isProgramOutcomes?: boolean }) {
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
        ? `The broader skills and knowledge this course contributes to at the program level.`
        : `The specific skills and knowledge you will gain by the end of ${courseName}.`;
    const icon = isProgramOutcomes ? <Target className="w-6 h-6 text-primary" /> : <Award className="w-6 h-6 text-primary" />;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    {icon}
                    {title}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Description</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-bold">{item.id}</TableCell>
                                <TableCell>{item.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

    

    