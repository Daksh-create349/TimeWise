
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
            } catch (e: any)_mod> I see this error with the app, reported by NextJS, please fix it. The error is reported as HTML but presented visually to the user).

A > before the line number in the error source usually indicates the line of interest: 

> Console Error: Error: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent: [503 Service Unavailable] The model is overloaded. Please try again later.. Error source: src/app/dashboard/faculty/timetable/page.tsx (89:19) @ onSubmit
> 
>   87 |         
>   88 |         if (result.error || !result.data) {
> > 89 |             throw new Error(result.error || "AI returned an unexpected response.");
>      |                   ^
>   90 |         }
>   91 |
>   92 |         if (!result.data.scheduleEvents || result.data.scheduleEvents.length === 0) {
> 
> Call Stack
> 2
> 
> Show 1 ignore-listed frame(s)
> onSubmit
> src/app/dashboard/faculty/timetable/page.tsx (89:19)