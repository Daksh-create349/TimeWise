
"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, CheckCircle, Bluetooth, Loader2, BluetoothSearching, XCircle, Smartphone } from "lucide-react";
import { useAttendance } from "@/context/AttendanceContext";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Status = "idle" | "scanning" | "showingDevices" | "connecting" | "connected" | "error";
type MockDevice = { name: string; id: string };

const allMockDevices: MockDevice[] = [
    { name: "Redmi Note 12", id: "dev1" },
    { name: "Boult Airbass", id: "dev2" },
    { name: "Samsung S25", id: "dev3" },
    { name: "iPhone 14", id: "dev4" },
];


export default function BluetoothAttendanceCard() {
  const { activeSession, submitAnswer, presentStudents } = useAttendance();
  const [answer, setAnswer] = useState("");
  const { toast } = useToast();

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [discoveredDevices, setDiscoveredDevices] = useState<MockDevice[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Effect to reset the card's state if the session changes
  useEffect(() => {
    setStatus("idle");
    setError(null);
    setAnswer("");
    setDiscoveredDevices([]);
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSession]);

  if (!activeSession) {
    return null;
  }

  const isPresent = presentStudents.includes(activeSession.subject);

  const handleStartScan = () => {
    setStatus("scanning");
    setDiscoveredDevices([]);

    let deviceIndex = 0;
    intervalRef.current = setInterval(() => {
        if (deviceIndex < allMockDevices.length) {
            setDiscoveredDevices(prev => [...prev, allMockDevices[deviceIndex]]);
            deviceIndex++;
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            setStatus("showingDevices");
        }
    }, 2000);
  };

  const handleDeviceSelect = (deviceName: string) => {
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
    }
    setStatus("connecting");
    toast({ title: `Connecting to ${deviceName}...` });
    setTimeout(() => {
        setStatus("connected");
        toast({ title: "Connected!", description: "Please answer the question to mark your attendance." });
    }, 1500); // Simulate 1.5 seconds of connecting
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
            return <Button className="w-full" onClick={handleStartScan}><Bluetooth className="mr-2 h-4 w-4"/>Connect via Bluetooth</Button>;
        case "scanning":
        case "showingDevices":
            return (
                <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-400 mb-4">
                        <BluetoothSearching className="h-5 w-5 animate-pulse" />
                        <p className="font-semibold">Scanning for faculty device...</p>
                    </div>
                    {discoveredDevices.map(device => (
                        <Button key={device.id} variant="outline" className="w-full justify-start gap-2" onClick={() => handleDeviceSelect(device.name)}>
                           <Smartphone /> {device.name}
                        </Button>
                    ))}
                    {status === "scanning" && discoveredDevices.length === 0 && <p className="text-center text-sm text-muted-foreground">Searching...</p>}
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
            );
        case "error":
            return (
                <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Simulation Error</AlertTitle>
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
