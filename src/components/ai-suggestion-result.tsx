import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, GraduationCap, Lightbulb, Link as LinkIcon, Globe } from "lucide-react";

interface Suggestion {
  summary: string;
  suggested_courses: { course_code: string; course_name: string; reason: string }[];
  learning_resources: {
    books: { title: string; author: string; reason: string }[];
    websites: { name: string; url: string; reason:string }[];
  };
  study_strategies: string[];
}

export default function AiSuggestionResult({ suggestions }: { suggestions: Suggestion }) {
  return (
    <Card className="border-primary/50 border-2 bg-secondary/30">
        <CardHeader>
            <CardTitle className="font-headline text-xl">Your Personalized Suggestions</CardTitle>
            <CardDescription>{suggestions.summary}</CardDescription>
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
                       <ul className="space-y-4">
                         {suggestions.suggested_courses.map(course => (
                            <li key={course.course_code}>
                                <p className="font-semibold">{course.course_name} ({course.course_code})</p>
                                <p className="text-sm text-muted-foreground">{course.reason}</p>
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
                        <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2"><Book className="h-4 w-4"/>Books</h4>
                            <ul className="space-y-3 list-disc list-inside">
                                {suggestions.learning_resources.books.map(book => (
                                    <li key={book.title}>
                                        <span className="font-semibold">{book.title}</span> by {book.author}
                                        <p className="text-sm text-muted-foreground pl-4">{book.reason}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2"><Globe className="h-4 w-4"/>Websites</h4>
                            <ul className="space-y-3 list-disc list-inside">
                                {suggestions.learning_resources.websites.map(site => (
                                     <li key={site.name}>
                                        <a href={site.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline flex items-center gap-1">
                                            {site.name} <LinkIcon className="h-3 w-3" />
                                        </a>
                                        <p className="text-sm text-muted-foreground pl-4">{site.reason}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
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
                            {suggestions.study_strategies.map((strategy, index) => (
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
