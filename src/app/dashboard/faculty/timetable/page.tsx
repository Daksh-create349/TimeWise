
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
import { Calendar, Loader2, PlusCircle, Sparkles, Trash2, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTimetable, Schedule } from '@/context/TimetableContext';
import TimetableDisplay from '@/components/dashboard/faculty/timetable-display';


const formSchema = z.object({
  subjects: z.array(z.object({ value: z.string().min(2, "Subject must be at least 2 characters.") })).min(1, "Please add at least one subject."),
  faculty: z.array(z.object({ value: z.string().min(2, "Faculty name must be at least 2 characters.") })).min(1, "Please add at least one faculty member."),
  constraints: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const times = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Manual timetable generation logic
const generateManualTimetable = (subjects: string[], faculty: string[]): Schedule => {
  const schedule: Schedule = {};
  let subjectIndex = 0;
  let facultyIndex = 0;

  times.forEach(time => {
    schedule[time] = {};
    days.forEach(day => {
      if (time === "12:00 PM") {
        schedule[time][day] = { subject: "Break" };
      } else {
        schedule[time][day] = {
          subject: subjects[subjectIndex % subjects.length],
          teacher: faculty[facultyIndex % faculty.length],
        };
        subjectIndex++;
        // Ensure faculty doesn't teach two classes at once (simple increment)
        if (subjectIndex % (subjects.length -1) === 0) {
            facultyIndex++;
        }
      }
    });
    // Move to next faculty for next time slot to vary assignments
    facultyIndex++; 
  });
  return schedule;
};


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
      constraints: "This is a simple generator. Constraints are not yet supported.",
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
      description: "Creating a new schedule based on your inputs.",
    });

    // Simulate generation time
    setTimeout(() => {
        try {
        const result = generateManualTimetable(
            data.subjects.map(s => s.value),
            data.faculty.map(f => f.value)
        );
        
        setGeneratedSchedule(result);
        toast({
            title: "Timetable Generated!",
            description: "The new weekly timetable has been successfully created.",
        });

        } catch (error) {
        console.error("Timetable generation failed:", error);
        toast({
            variant: "destructive",
            title: "Generation Failed",
            description: "Could not generate a timetable. Please check your inputs.",
        });
        } finally {
        setIsLoading(false);
        }
    }, 1000);
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
                        <Settings className="h-8 w-8 text-primary" />
                        <div>
                        <CardTitle className="font-headline text-2xl">Timetable Generator</CardTitle>
                        <CardDescription>Provide subjects and faculty to create a weekly schedule.</CardDescription>
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
                                        readOnly
                                    />
                                </FormControl>
                                <FormDescription>Constraint handling is not supported in the manual generator.</FormDescription>
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
