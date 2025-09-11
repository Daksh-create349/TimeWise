
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HelpCircle, Send, CheckCircle, XCircle } from "lucide-react";
import { useAttendance } from "@/context/AttendanceContext";
import { useToast } from "@/hooks/use-toast";

export default function StudentAttendanceCard() {
  const { activeSession, submitAnswer, presentStudents } = useAttendance();
  const [answer, setAnswer] = useState("");
  const { toast } = useToast();

  if (!activeSession) {
    return null; // Don't show the card if there's no active session
  }

  const isPresent = presentStudents.includes(activeSession.subject);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer) return;

    const correct = submitAnswer(activeSession.subject, answer);
    if (correct) {
      toast({
        title: "Correct!",
        description: `You have been marked present for ${activeSession.subject}.`,
        className: "bg-green-100 dark:bg-green-900/50 border-green-500/50",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Incorrect Answer",
        description: "Please try again.",
      });
    }
    setAnswer("");
  };

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3">
            <HelpCircle className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="font-headline text-2xl">Attendance Check!</CardTitle>
              <CardDescription>
                An attendance question for <strong>{activeSession.subject}</strong> is now live. Answer below to be marked present.
              </CardDescription>
            </div>
          </div>
      </CardHeader>
      <CardContent>
        <p className="text-xl text-center font-semibold mb-4">"{activeSession.question}"</p>
        
        {isPresent ? (
          <div className="flex items-center justify-center gap-2 text-lg font-semibold text-green-600 bg-green-100 dark:bg-green-900/50 p-4 rounded-md">
            <CheckCircle />
            <span>You are marked present!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input 
              type="text" 
              placeholder="Your answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)} 
              required
            />
            <Button type="submit">
              <Send className="mr-2 h-4 w-4" />
              Submit
            </Button>
          </form>
        )}

      </CardContent>
    </Card>
  );
}
