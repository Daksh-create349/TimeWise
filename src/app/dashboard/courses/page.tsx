import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function CoursesPage() {
  return (
    <div>
        <Card>
            <CardHeader>
                <CardTitle>Your Courses</CardTitle>
                <CardDescription>This section will display all your enrolled courses.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-60">
                <BookOpen className="h-16 w-16 mb-4" />
                <p>Course details, materials, and grades will be available here.</p>
            </CardContent>
        </Card>
    </div>
  );
}
