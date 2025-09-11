
"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { getLeaveRequestPreview } from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, File, Loader2, Send, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/cn";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { isDateRange } from "@/lib/utils";


const initialState = {
  data: null,
  error: null,
};

export default function ComposeLeaveRequestPage() {
  const [state, formAction] = useActionState(getLeaveRequestPreview, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const [leaveType, setLeaveType] = useState<string | undefined>();
  const [date, setDate] = useState<DateRange | undefined>();
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (formRef.current) {
        const formData = new FormData(formRef.current);
        const hasRequiredFields = formData.get('leaveType') && formData.get('fromDate') && formData.get('toDate') && formData.get('reason');

        if (hasRequiredFields) {
            const debouncedAction = setTimeout(() => {
                formAction(formData);
            }, 1000); // Debounce to avoid spamming requests

            return () => clearTimeout(debouncedAction);
        }
    }
  }, [leaveType, date, reason, formAction]);

   const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
        title: "Leave Request Sent",
        description: "Your leave request has been successfully sent for approval.",
    });
    formRef.current?.reset();
    setDate(undefined);
    setLeaveType(undefined);
    setReason("");
  }


  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Form Column */}
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Send className="h-8 w-8 text-primary" />
                        <div>
                        <CardTitle className="font-headline text-2xl">Compose Leave Request</CardTitle>
                        <CardDescription>Fill in the details to generate a professional leave request email.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <form ref={formRef} onChange={(e) => {
                 const formData = new FormData(e.currentTarget);
                 formAction(formData);
            }} onSubmit={handleSubmit} className="space-y-6">
                
                {/* To/CC/Subject - Readonly */}
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <div className="grid grid-cols-5 items-center">
                            <Label className="text-muted-foreground col-span-1">To</Label>
                            <Input value="admin@university.edu" readOnly className="col-span-4 bg-muted/50 border-none"/>
                        </div>
                         <div className="grid grid-cols-5 items-center">
                            <Label className="text-muted-foreground col-span-1">CC</Label>
                            <Input value="department.head@university.edu" readOnly className="col-span-4 bg-muted/50 border-none"/>
                        </div>
                         <div className="grid grid-cols-5 items-center">
                            <Label className="text-muted-foreground col-span-1">Subject</Label>
                            <Input name="subject" value={`Leave Request - ${leaveType || '...'}`} readOnly className="col-span-4 bg-muted/50 border-none"/>
                        </div>
                    </CardContent>
                </Card>

                {/* Form Inputs */}
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="leave-type">Leave Type *</Label>
                            <Select name="leaveType" required value={leaveType} onValueChange={setLeaveType}>
                                <SelectTrigger id="leave-type">
                                <SelectValue placeholder="Select a leave type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Emergency Leave">Emergency Leave</SelectItem>
                                    <SelectItem value="Medical Leave">Medical Leave</SelectItem>
                                    <SelectItem value="Personal Leave">Personal Leave</SelectItem>
                                    <SelectItem value="Conference/Duty Leave">Conference/Duty Leave</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="from-date">From & To Dates *</Label>
                                <Input type="hidden" name="fromDate" value={date?.from ? format(date.from, 'yyyy-MM-dd') : ''} />
                                <Input type="hidden" name="toDate" value={date?.to ? format(date.to, 'yyyy-MM-dd') : ''} />
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <Button
                                        id="leave-dates"
                                        variant={"outline"}
                                        className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date?.from ? (
                                            date.to ? (
                                                <>
                                                {format(date.from, "LLL dd, y")} -{" "}
                                                {format(date.to, "LLL dd, y")}
                                                </>
                                            ) : (
                                                format(date.from, "LLL dd, y")
                                            )
                                        ) : (
                                            <span>dd/mm/yyyy - dd/mm/yyyy</span>
                                        )}
                                    </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={date?.from}
                                        selected={date}
                                        onSelect={setDate}
                                        numberOfMonths={1}
                                    />
                                    </PopoverContent>
                                </Popover>
                            </div>
                         </div>
                        <div className="space-y-2">
                            <Label htmlFor="reason">Reason for Leave *</Label>
                            <Textarea name="reason" id="reason" placeholder="Please provide a brief explanation for your leave request" required rows={4} value={reason} onChange={(e) => setReason(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="proxy">Proxy Arrangements</Label>
                            <Textarea name="proxy" id="proxy" placeholder="Describe how your classes will be covered" rows={2} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Additional Notes</Label>
                            <Textarea name="notes" id="notes" placeholder="Any additional information" rows={2}/>
                        </div>
                        <div className="space-y-2">
                            <Label>Supporting Documents</Label>
                            <Button variant="outline" className="w-full justify-center gap-2" type="button">
                                <File className="h-4 w-4" /> Add File
                            </Button>
                        </div>

                    </CardContent>
                </Card>
                <Button type="submit" className="w-full">
                    <Send className="mr-2 h-4 w-4" /> Send Leave Request
                </Button>
            </form>
        </div>

        {/* Preview Column */}
        <div>
            <Card className="sticky top-24">
                 <CardHeader>
                    <CardTitle className="font-headline text-xl">Email Preview</CardTitle>
                    <CardDescription>Preview of the generated email that will be sent.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg p-4 space-y-4 min-h-[400px]">
                        <p><span className="font-semibold">To:</span> admin@university.edu</p>
                        <p><span className="font-semibold">CC:</span> department.head@university.edu</p>
                        <p><span className="font-semibold">Subject:</span> Leave Request - {leaveType || '...'}</p>
                        <hr/>
                        
                        {!state.data && !state.error && (
                             <div className="text-center text-muted-foreground pt-16">
                                <Sparkles className="mx-auto h-12 w-12" />
                                <p className="mt-4">
                                Fill in the required fields to generate an email preview.
                                </p>
                            </div>
                        )}

                        {state.error && (
                            <div className="mt-4 text-center text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                                <p>Error: {state.error}</p>
                            </div>
                        )}
                        
                        {state.data && (
                           <div className="prose prose-sm dark:prose-invert max-w-none">
                             <p>Dear Administrator,</p>
                             <pre className="whitespace-pre-wrap font-sans bg-transparent p-0">{state.data.emailBody}</pre>
                           </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>

    </div>
  );
}
