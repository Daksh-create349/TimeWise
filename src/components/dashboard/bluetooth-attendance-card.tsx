
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, CheckCircle, Bluetooth, Loader2, BluetoothSearching, XCircle } from "lucide-react";
import { useAttendance } from "@/context/AttendanceContext";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ATTENDANCE_SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const QUESTION_CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';


type Status = "idle" | "scanning" | "connecting" | "connected" | "error";

export default function BluetoothAttendanceCard() {
  const { activeSession, submitAnswer, presentStudents } = useAttendance();
  const [answer, setAnswer] = useState("");
  const { toast } = useToast();

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [sessionQuestion, setSessionQuestion] = useState<string | null>(null);
  
  if (!activeSession) {
    return null; // Don't show the card if there's no active session
  }

  const isPresent = presentStudents.includes(activeSession.subject);

  const handleConnect = async () => {
    if (!navigator.bluetooth) {
      setError("Web Bluetooth is not available on this browser. Please use Chrome on Desktop or Android.");
      setStatus("error");
      return;
    }

    setStatus("scanning");
    setError(null);

    try {
      toast({ title: "Scanning for devices...", description: "Please select the faculty device from the browser prompt." });

      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [ATTENDANCE_SERVICE_UUID] }],
        optionalServices: [ATTENDANCE_SERVICE_UUID]
      });

      setStatus("connecting");
      toast({ title: "Connecting...", description: `Connecting to ${device.name || 'the selected device'}...` });
      
      const server = await device.gatt?.connect();
      if (!server) throw new Error("Could not connect to GATT server.");
      
      const service = await server.getPrimaryService(ATTENDANCE_SERVICE_UUID);
      if (!service) throw new Error("Attendance service not found.");

      const characteristic = await service.getCharacteristic(QUESTION_CHARACTERISTIC_UUID);
      if (!characteristic) throw new Error("Question characteristic not found.");
      
      // In a real scenario, we would read the value. Here we use the context value.
      // const value = await characteristic.readValue();
      // const decoder = new TextDecoder('utf-8');
      // const question = decoder.decode(value);
      // setSessionQuestion(question);
      
      // For this demo, we'll use the question from the context
      setSessionQuestion(activeSession.question);

      setStatus("connected");
      toast({ title: "Connected!", description: "Please answer the question to mark your attendance." });

    } catch (err: any) {
      console.error("Bluetooth connection failed:", err);
      let errorMessage = "Failed to connect. Please ensure you are close to the faculty device and try again.";
      if (err.name === 'NotFoundError') {
        errorMessage = "No advertising device found. Please ask the faculty to start the session.";
      } else if (err.name === 'NotAllowedError') {
          errorMessage = "Permission to use Bluetooth was denied."
      }
      setError(errorMessage);
      setStatus("error");
      toast({ variant: "destructive", title: "Connection Failed", description: errorMessage });
    }
  };

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
  
  const renderContent = () => {
    if (isPresent) {
      return (
        <div className="flex items-center justify-center gap-2 text-lg font-semibold text-green-600 bg-green-100 dark:bg-green-900/50 p-4 rounded-md">
            <CheckCircle />
            <span>You are marked present!</span>
        </div>
      )
    }

    switch(status) {
        case "idle":
            return <Button className="w-full" onClick={handleConnect}><Bluetooth className="mr-2 h-4 w-4"/>Connect via Bluetooth</Button>;
        case "scanning":
            return (
                <div className="flex flex-col items-center justify-center h-24 text-blue-700 dark:text-blue-400">
                    <BluetoothSearching className="h-10 w-10 animate-pulse" />
                    <p className="mt-2 font-semibold">Scanning for faculty device...</p>
                    <p className="text-sm">Check browser prompt to select device.</p>
                </div>
            );
        case "connecting":
            return (
                <div className="flex flex-col items-center justify-center h-24 text-blue-700 dark:text-blue-400">
                    <Loader2 className="h-10 w-10 animate-spin" />
                    <p className="mt-2 font-semibold">Connecting...</p>
                </div>
            );
        case "connected":
             return (
              <div>
                <p className="text-xl text-center font-semibold mb-4 text-primary">"{sessionQuestion}"</p>
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
            );
        case "error":
            return (
                <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Bluetooth Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                    <Button variant="secondary" size="sm" onClick={() => setStatus("idle")} className="mt-4">Try Again</Button>
                </Alert>
            );
    }
  }

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
          {renderContent()}
      </CardContent>
    </Card>
  );
}
