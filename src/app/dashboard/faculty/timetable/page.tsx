
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
import { Loader2, PlusCircle, Sparkles, Trash2, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTimetable } from '@/context/TimetableContext';
import type { BatchTimetables } from '@/context/TimetableContext';
import TimetableDisplay from '@/components/dashboard/faculty/timetable-display';
import { generateTimetableAction } from './actions';


const formSchema = z.object({
  subjects: z.array(z.object({ value: z.string().min(2, "Subject must be at least 2 characters.") })).min(1, "Please add at least one subject."),
  faculty: z.array(z.object({ value: z.string().min(2, "Faculty name must be at least 2 characters.") })).min(1, "Please add at least one faculty member."),
  batches: z.array(z.object({ value: z.string().min(2, "Batch name must be at least 2 characters.") })).min(1, "Please add at least one batch.").max(4, "You can generate timetables for a maximum of 4 batches at a time."),
  constraints: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function GenerateTimetablePage() {
  const { toast } = useToast();
  const { setSchedule, setBatches } = useTimetable();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedSchedules, setGeneratedSchedules] = useState<BatchTimetables | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjects: [{ value: 'Mathematics' }, { value: 'Physics' }, { value: 'English' }, { value: 'Computer Science' }, { value: 'Biology' }, { value: 'History' }],
      faculty: [{ value: 'Dr. Evelyn Reed' }, { value: 'Prof. Samuel Chen' }, { value: 'Dr. Maria Garcia' }, { value: 'Prof. Ben Carter' }, { value: 'Dr. Aisha Khan' }],
      batches: [{ value: 'Computer Science 2023' }, { value: 'Mathematics 2023' }],
      constraints: "No classes on Friday afternoons. Dr. Evelyn Reed prefers morning classes.",
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

   const { fields: batchFields, append: appendBatch, remove: removeBatch } = useFieldArray({
    control: form.control,
    name: "batches",
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setGeneratedSchedules(null);
    toast({
      title: "Generating Timetables with AI...",
      description: "Our AI is creating new schedules. This may take a moment.",
    });

    try {
        const input = {
            subjects: data.subjects.map(s => s.value),
            faculty: data.faculty.map(f => f.value),
            batches: data.batches.map(b => b.value),
            constraints: data.constraints,
        };
        
        const result = await generateTimetableAction(input);
        
        if (result.error || !result.data) {
            throw new Error(result.error || "AI returned an unexpected response.");
        }
        
        // Transform the AI output to the format expected by the UI
        const transformedSchedules: BatchTimetables = {};
        const rawSchedules = result.data.schedules;
        
        // The AI returns objects like { batchOne: { 'Batch Name': schedule } }
        // We need to flatten this.
        Object.values(rawSchedules).forEach(batchObject => {
            if (batchObject) {
                const batchName = Object.keys(batchObject)[0];
                const schedule = Object.values(batchObject)[0];
                if (batchName && schedule) {
                    transformedSchedules[batchName] = schedule;
                }
            }
        });


        if (Object.keys(transformedSchedules).length === 0) {
            throw new Error("AI did not return any valid schedules. Please try again.");
        }

        setGeneratedSchedules(transformedSchedules);
        toast({
            title: "AI Timetables Generated!",
            description: "New weekly timetables have been successfully created by the AI.",
        });

    } catch (error: any) {
        console.error("Timetable generation failed:", error);
        toast({
            variant: "destructive",
            title: "AI Generation Failed",
            description: error.message || "The AI could not generate timetables. Please check your inputs or try again.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  const handlePublish = (batchName: string, schedule: any) => {
    if(schedule) {
      setSchedule(schedule); // Set the main schedule to the selected batch's schedule for student view
      if (generatedSchedules) {
        setBatches(Object.keys(generatedSchedules));
      }
      toast({
        title: "Timetable Published!",
        description: `The timetable for ${batchName} is now live for all students.`,
      });
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Settings className="h-8 w-8 text-primary" />
                        <div>
                        <CardTitle className="font-headline text-2xl">AI Timetable Generator</CardTitle>
                        <CardDescription>Provide inputs to create weekly schedules for multiple batches.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        
                        <div>
                            <FormField
                                control={form.control}
                                name="batches"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Batches</FormLabel>
                                        <FormDescription className="text-xs mb-2">List of student batches to schedule (max 4).</FormDescription>
                                        <div className="space-y-2">
                                            {batchFields.map((field, index) => (
                                                <FormField
                                                key={field.id}
                                                control={form.control}
                                                name={`batches.${index}.value`}
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center gap-2">
                                                        <FormControl>
                                                            <Input {...field} placeholder="e.g., Computer Science 2023" />
                                                        </FormControl>
                                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeBatch(index)}>
                                                            <Trash2 className="h-4 w-4 text-destructive"/>
                                                        </Button>
                                                    </FormItem>
                                                )}
                                                />
                                            ))}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendBatch({ value: '' })}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Batch
                            </Button>
                        </div>

                        <Separator />

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
                                <FormDescription>Provide any scheduling rules for the AI.</FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating with AI...
                            </>
                            ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate with AI
                            </>
                            )}
                        </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-2">
            <TimetableDisplay schedules={generatedSchedules} onPublish={handlePublish} />
        </div>
    </div>
  );
}
