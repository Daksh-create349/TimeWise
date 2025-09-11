"use client";

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Calendar, Loader2, PlusCircle, Sparkles, Trash2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateTimetable } from '@/ai/flows/generate-timetable-flow';
import { useTimetable, Schedule } from '@/context/TimetableContext';
import TimetableDisplay from '@/components/dashboard/faculty/timetable-display';


const formSchema = z.object({
  subjects: z.array(z.object({ value: z.string().min(2, "Subject must be at least 2 characters.") })).min(1, "Please add at least one subject."),
  faculty: z.array(z.object({ value: z.string().min(2, "Faculty name must be at least 2 characters.") })).min(1, "Please add at least one faculty member."),
  constraints: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function GenerateTimetablePage() {
  const { toast } = useToast();
  const { setSchedule } = useTimetable();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedSchedule, setGeneratedSchedule] = useState<Schedule | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjects: [{ value: 'Mathematics' }, { value: 'Physics' }, { value: 'English' }, { value: 'Computer Science' }, { value: 'Biology' }],
      faculty: [{ value: 'Dr. Smith' }, { value: 'Prof. Johnson' }, { value: 'Ms. Davis' }, { value: 'Prof. Wilson' }, { value: 'Dr. Green' }],
      constraints: "Dr. Smith cannot teach on Fridays. Physics should not be the first class of the day.",
    },
  });

  const { fields: subjectFields, append: appendSubject, remove: removeSubject } = useFieldArray({
    control: form.control,
    name: "subjects",
  });

  const { fields: facultyFields, append: appendFaculty, remove: removeFaculty } = useFieldArray({
    control: form.control,
    name: "faculty",
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setGeneratedSchedule(null);
    toast({
      title: "Generating Timetable...",
      description: "The AI is working its magic. This might take a moment.",
    });
    try {
      const result = await generateTimetable({
        subjects: data.subjects.map(s => s.value),
        faculty: data.faculty.map(f => f.value),
        constraints: data.constraints,
      });

      if (!result?.schedule) {
        throw new Error("AI returned an unexpected response.");
      }
      
      setGeneratedSchedule(result.schedule);
      toast({
        title: "Timetable Generated!",
        description: "The new weekly timetable has been successfully created.",
      });

    } catch (error) {
      console.error("Timetable generation failed:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "The AI failed to generate a timetable. Please check your inputs or try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = () => {
    if(generatedSchedule) {
      // @ts-ignore
      setSchedule(generatedSchedule);
      toast({
        title: "Timetable Published!",
        description: "The new timetable is now live for all students.",
      });
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Wand2 className="h-8 w-8 text-primary" />
                        <div>
                        <CardTitle className="font-headline text-2xl">AI Timetable Generator</CardTitle>
                        <CardDescription>Provide the necessary details and let AI create the perfect schedule.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        
                        <div>
                            <FormLabel>Subjects</FormLabel>
                            <FormDescription className="text-xs mb-2">List of all subjects to be scheduled.</FormDescription>
                            <div className="space-y-2">
                                {subjectFields.map((field, index) => (
                                    <FormField
                                    key={field.id}
                                    control={form.control}
                                    name={`subjects.${index}.value`}
                                    render={({ field }) => (
                                        <FormItem className="flex items-center gap-2">
                                            <FormControl>
                                                <Input {...field} placeholder="e.g., Quantum Physics" />
                                            </FormControl>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeSubject(index)}>
                                                <Trash2 className="h-4 w-4 text-destructive"/>
                                            </Button>
                                        </FormItem>
                                    )}
                                    />
                                ))}
                            </div>
                            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendSubject({ value: '' })}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Subject
                            </Button>
                        </div>

                        <Separator />

                        <div>
                            <FormLabel>Faculty Members</FormLabel>
                            <FormDescription className="text-xs mb-2">List of all available teachers.</FormDescription>
                            <div className="space-y-2">
                                {facultyFields.map((field, index) => (
                                    <FormField
                                    key={field.id}
                                    control={form.control}
                                    name={`faculty.${index}.value`}
                                    render={({ field }) => (
                                        <FormItem className="flex items-center gap-2">
                                            <FormControl>
                                                <Input {...field} placeholder="e.g., Dr. Evelyn Reed" />
                                            </FormControl>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeFaculty(index)}>
                                                <Trash2 className="h-4 w-4 text-destructive"/>
                                            </Button>
                                        </FormItem>
                                    )}
                                    />
                                ))}
                            </div>
                             <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendFaculty({ value: '' })}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Faculty
                            </Button>
                        </div>
                        
                        <Separator />
                        
                        <FormField
                            control={form.control}
                            name="constraints"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Constraints (Optional)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="e.g., No classes on Friday afternoon.&#10;Dr. Smith prefers morning classes."
                                        rows={4}
                                    />
                                </FormControl>
                                <FormDescription>Provide any specific rules or preferences for the AI to follow.</FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                            ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate Timetable
                            </>
                            )}
                        </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-2">
            <TimetableDisplay schedule={generatedSchedule} onPublish={handlePublish} />
        </div>
    </div>
  );
}
