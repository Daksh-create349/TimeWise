
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HelpCircle, Send, CheckCircle, Bluetooth, Loader2 } from "lucide-react";
import { useAttendance } from "@/context/AttendanceContext";
import { useToast } from "@/hooks/use-toast";

export default function BluetoothAttendanceCard() {
  const { activeSession, submitAnswer, presentStudents } = useAttendance();
  const [answer, setAnswer] = useState("");
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  if (!activeSession) {
    return null; // Don't show the card if there's no active session
  }

  const isPresent = presentStudents.includes(activeSession.subject);

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
        toast({
            title: "Connected!",
            description: `Successfully connected to ${activeSession.subject} attendance session.`,
        });
    }, 1500); // Simulate connection delay
  }

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
    <Card className="bg-blue-500/10 border-blue-500/30">
      <CardHeader>
        <div className="flex items-center gap-3">
            <Bluetooth className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div>
              <CardTitle className="font-headline text-2xl text-blue-800 dark:text-blue-300">Bluetooth Attendance</CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-400">
                A check-in for <strong>{activeSession.subject}</strong> is available. Connect to mark your attendance.
              </CardDescription>
            </div>
          </div>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
            <Button className="w-full" onClick={handleConnect} disabled={isConnecting}>
                {isConnecting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                ) : (
                    <Bluetooth className="mr-2 h-4 w-4"/>
                )}
                {isConnecting ? "Connecting..." : "Connect via Bluetooth"}
            </Button>
        ) : isPresent ? (
          <div className="flex items-center justify-center gap-2 text-lg font-semibold text-green-600 bg-green-100 dark:bg-green-900/50 p-4 rounded-md">
            <CheckCircle />
            <span>You are marked present!</span>
          </div>
        ) : (
          <div>
            <p className="text-xl text-center font-semibold mb-4 text-primary">"{activeSession.question}"</p>
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
