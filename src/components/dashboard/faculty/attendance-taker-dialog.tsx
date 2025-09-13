
'use client';

import { useEffect, useState } from 'react';
import { generateAttendanceQuestion } from '@/ai/flows/generate-attendance-question-flow';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, QrCode, RefreshCw, XCircle, Bluetooth, BluetoothConnected } from 'lucide-react';
import Image from 'next/image';
import { useAttendance } from '@/context/AttendanceContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AttendanceTakerDialogProps {
  subject: string;
}

interface QuestionState {
  question: string;
}

// Mocking the GATT server for demo purposes on the faculty side.
// In a real scenario with two devices, the faculty device would actually run this.
const mockGattServer = {
  serviceUuid: '4fafc201-1fb5-459e-8fcc-c5c9c331914b', // A standard service UUID for our app
  questionCharacteristicUuid: 'beb5483e-36e1-4688-b7f5-ea07361b26a8',
  async startAdvertising(question: string) {
    if (typeof navigator !== 'undefined' && navigator.bluetooth) {
       try {
        // We can't *actually* advertise from a browser, this is a limitation.
        // We log it to show what would happen. The student device will scan for this UUID.
        console.log(`Pretending to advertise Bluetooth service: ${this.serviceUuid}`);
        console.log(`With question characteristic value: "${question}"`);
      } catch (error) {
        console.error("Web Bluetooth 'advertising' simulation failed:", error);
      }
    } else {
      console.log("Web Bluetooth not supported, cannot simulate advertising.");
    }
  },
};


export default function AttendanceTakerDialog({ subject }: AttendanceTakerDialogProps) {
  const [questionState, setQuestionState] = useState<QuestionState | null>(null);
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionActive, setIsSessionActive] = useState<"qr" | "bluetooth" | null>(null);
  const { toast } = useToast();
  const { startAttendance, closeAttendance } = useAttendance();
  
  const studentUrl = `https://university.com/attend?c=${subject.replace(/\s/g, "")}`; // This is a mock URL

  const fetchQuestion = async () => {
    setIsLoading(true);
    setQuestionState(null);
    setAnswer('');
    setIsSessionActive(null);
    try {
      const result = await generateAttendanceQuestion({ subject });
      setQuestionState(result);
    } catch (error) {
      console.error('Failed to generate attendance question:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Could not generate a unique question. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject]);

  const handleStartSession = (type: "qr" | "bluetooth") => {
      if (!questionState || !answer) {
          toast({
              variant: 'destructive',
              title: 'Missing Answer',
              description: 'Please provide an answer before starting the session.',
          });
          return;
      }
      if (type === 'bluetooth') {
        mockGattServer.startAdvertising(questionState.question);
      }

      startAttendance({ subject, question: questionState.question, answer });
      setIsSessionActive(type);
      toast({
          title: `Attendance Session Started (${type})`,
          description: `The session is now live for students to join.`,
      });
  }

  const handleCloseSession = () => {
      closeAttendance();
      setIsSessionActive(null);
      toast({
          title: "Attendance Session Closed",
          description: "Students can no longer submit answers.",
      });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-headline text-2xl flex items-center gap-2">
            <Sparkles className='w-6 h-6 text-primary' />
            AI Attendance Question
        </DialogTitle>
        <DialogDescription>
          For <span className="font-bold">{subject}</span>
        </DialogDescription>
      </DialogHeader>

      <div className="py-6 text-center space-y-6">
        {isLoading && (
          <div className='flex flex-col items-center gap-4 text-muted-foreground h-40 justify-center'>
            <Loader2 className="h-8 w-8 animate-spin" />
            <p>Generating a unique question...</p>
          </div>
        )}

        {questionState && !isSessionActive && (
          <div className='space-y-4'>
            <p className="text-2xl font-semibold font-headline">"{questionState.question}"</p>
             <div className="space-y-2 text-left">
                <Label htmlFor="expected-answer">Expected Answer</Label>
                <Input 
                    id="expected-answer" 
                    placeholder="Enter the correct answer here"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    disabled={!!isSessionActive}
                />
            </div>
          </div>
        )}

        {isSessionActive === 'qr' && (
          <>
            <div className='flex justify-center'>
                <Image 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(studentUrl)}`}
                    alt="QR Code for attendance"
                    width={150}
                    height={150}
                    className='rounded-lg border p-1'
                />
            </div>
            <div className='text-xs text-muted-foreground space-y-1'>
                <p>Students can scan the QR code or go to:</p>
                <p className='font-mono text-primary underline'>{studentUrl}</p>
            </div>
          </>
        )}
        
        {isSessionActive === 'bluetooth' && (
            <div className='flex flex-col items-center gap-4 text-muted-foreground h-40 justify-center'>
                <BluetoothConnected className="h-12 w-12 text-primary animate-pulse" />
                <p className='font-semibold text-primary'>Bluetooth Session Active</p>
                <p className='text-sm'>Broadcasting attendance service. Students can now connect.</p>
            </div>
        )}
      </div>

      <DialogFooter className="sm:justify-between gap-2 flex-wrap">
         <Button variant="outline" onClick={fetchQuestion} disabled={isLoading || !!isSessionActive}>
            <RefreshCw className="mr-2 h-4 w-4" />
            New Question
        </Button>
        {isSessionActive ? (
            <Button type="button" onClick={handleCloseSession} variant="destructive">
                <XCircle className="mr-2 h-4 w-4" />
                End Session
            </Button>
        ) : (
            <div className='flex gap-2'>
              <Button type="button" onClick={() => handleStartSession('bluetooth')} disabled={isLoading || !answer}>
                <Bluetooth className="mr-2 h-4 w-4" />
                Start Bluetooth Session
            </Button>
            <Button type="button" onClick={() => handleStartSession('qr')} disabled={isLoading || !answer}>
                <QrCode className="mr-2 h-4 w-4" />
                Start QR Code Session
            </Button>
            </div>
        )}
      </DialogFooter>
    </>
  );
}
