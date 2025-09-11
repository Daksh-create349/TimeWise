
"use client";

import { Suspense } from "react";
import CourseSidebar from "@/components/course-sidebar";
import { generateCourseTopics } from "@/ai/flows/generate-course-topics-flow";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

type Topic = {
  srNo: number;
  topicName: string;
};

const columns: ColumnDef<Topic>[] = [
  {
    accessorKey: "srNo",
    header: "Sr. No.",
    cell: ({ row }) => <div className="text-center">{row.getValue("srNo")}</div>,
  },
  {
    accessorKey: "topicName",
    header: "Topic Name",
  },
];

function CourseDetailPageContent() {
    const searchParams = useSearchParams();
    const courseName = searchParams.get('name') || "Course";
    const [topics, setTopics] = useState<Topic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTopics = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await generateCourseTopics({ courseTitle: courseName });
                if (result.topics) {
                    setTopics(result.topics.map((topic, index) => ({ srNo: index + 1, topicName: topic })));
                } else {
                    setError("Could not generate course topics.");
                }
            } catch (e: any) {
                setError(e.message || "An error occurred while fetching topics.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTopics();
    }, [courseName]);
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
                <CourseSidebar />
            </div>
            <div className="md:col-span-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">{courseName} - Course Topics</CardTitle>
                        <CardDescription>A detailed list of topics covered in this course.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading && (
                            <div className="flex justify-center items-center h-64 text-muted-foreground">
                                <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                                <p>AI is generating course topics...</p>
                            </div>
                        )}
                        {error && (
                             <div className="flex justify-center items-center h-64 text-destructive">
                                <p>Error: {error}</p>
                            </div>
                        )}
                        {!isLoading && !error && (
                            <DataTable columns={columns} data={topics} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}


export default function CourseDetailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CourseDetailPageContent />
        </Suspense>
    )
}
