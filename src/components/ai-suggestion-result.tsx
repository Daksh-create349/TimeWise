import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AiCourseSuggestionOutput } from "@/ai/ai-course-suggestion";
import { Book, GraduationCap, Lightbulb, Link as LinkIcon, Globe } from "lucide-react";

export default function AiSuggestionResult({ suggestions }: { suggestions: AiCourseSuggestionOutput }) {
  const { courses, resources, studyStrategies, summary } = suggestions.suggestions;
  
  return (
    <Card className="border-primary/50 border-2 bg-secondary/30">
        <CardHeader>
            <CardTitle className="font-headline text-xl">Your Personalized Suggestions</CardTitle>
            <CardDescription>{summary}</CardDescription>
        </CardHeader>
        <CardContent>
            <Accordion type="multiple" defaultValue={['courses', 'resources', 'strategies']} className="w-full">
                <AccordionItem value="courses">
                    <AccordionTrigger>
                        <div className="flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-primary"/>
                            <span className="font-semibold">Suggested Courses</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-4">
                       <ul className="space-y-4 list-disc list-inside">
                         {courses.map((course, index) => (
                            <li key={index}>
                                {course}
                            </li>
                         ))}
                       </ul>
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="resources">
                    <AccordionTrigger>
                        <div className="flex items-center gap-2">
                           <Book className="h-5 w-5 text-primary"/>
                           <span className="font-semibold">Learning Resources</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-4 space-y-4">
                        <ul className="space-y-3 list-disc list-inside">
                            {resources.map((resource, index) => (
                                <li key={index}>
                                    {resource}
                                </li>
                            ))}
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="strategies">
                    <AccordionTrigger>
                        <div className="flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-primary"/>
                           <span className="font-semibold">Actionable Strategies</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-4">
                        <ul className="space-y-2 list-decimal list-inside">
                            {studyStrategies.map((strategy, index) => (
                                <li key={index}>{strategy}</li>
                            ))}
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </CardContent>
    </Card>
  )
}
