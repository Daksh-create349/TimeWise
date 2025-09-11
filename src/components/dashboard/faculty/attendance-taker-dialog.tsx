
'use client';

import { useEffect, useState } from 'react';
import { generateAttendanceQuestion } from '@/ai/flows/generate-attendance-question-flow';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, QrCode, RefreshCw, XCircle } from 'lucide-react';
import Image from 'next/image';
import { useAttendance } from '@/context/AttendanceContext';

interface AttendanceTakerDialogProps {
  subject: string;
}

interface QuestionState {
  question: string;
  answer: string;
}

export default function AttendanceTakerDialog({ subject }: AttendanceTakerDialogProps) {
  const [questionState, setQuestionState] = useState<QuestionState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { startAttendance, closeAttendance } = useAttendance();
  
  const studentUrl = "https://university.com/attend?c=CS101"; // This is a mock URL

  const fetchQuestion = async () => {
    setIsLoading(true);
    setQuestionState(null);
    try {
      const result = await generateAttendanceQuestion({ subject });
      setQuestionState(result);
      startAttendance({ subject, ...result });
      toast({
          title: "Attendance Session Started",
          description: "The question is now live for students.",
      })
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

  const handleCloseSession = () => {
      closeAttendance();
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

        {questionState && (
          <div className='space-y-4'>
            <p className="text-2xl font-semibold font-headline">"{questionState.question}"</p>
            <p className="text-sm text-muted-foreground">
                Expected Answer: <span className="font-semibold text-foreground">{questionState.answer}</span>
            </p>
          </div>
        )}

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

      </div>

      <DialogFooter className="sm:justify-between gap-2">
         <Button variant="outline" onClick={fetchQuestion} disabled={isLoading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            New Question
        </Button>
        <Button type="button" onClick={handleCloseSession} disabled={isLoading}>
            <XCircle className="mr-2 h-4 w-4" />
          Close Session
        </Button>
      </DialogFooter>
    </>
  );
}
