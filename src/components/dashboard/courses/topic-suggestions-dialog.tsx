
"use client";

import { useState } from "react";
import { GenerateTopicSuggestionsOutput } from "@/ai/flows/generate-topic-suggestions-flow";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, Youtube, HelpCircle, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/cn";

interface TopicSuggestionsDialogProps {
  topicName: string;
  suggestions: GenerateTopicSuggestionsOutput | null;
  isLoading: boolean;
  error: string | null;
}

export default function TopicSuggestionsDialog({
  topicName,
  suggestions,
  isLoading,
  error,
}: TopicSuggestionsDialogProps) {

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleAnswerChange = (questionIndex: number, value: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionIndex]: value }));
  };
  
  const handleSubmitQuiz = () => {
      setSubmitted(true);
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg">AI is fetching suggestions for "{topicName}"...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-destructive bg-destructive/10 rounded-lg">
          <XCircle className="h-12 w-12" />
          <p className="mt-4 text-lg font-semibold">Error loading suggestions</p>
          <p className="text-sm">{error}</p>
        </div>
      );
    }

    if (!suggestions) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
          <p>No suggestions available at the moment.</p>
        </div>
      );
    }

    const { youtubeSuggestions, quiz } = suggestions;
    let score = 0;
    if(submitted) {
        quiz.forEach((q, index) => {
            if(selectedAnswers[index] === q.answer) {
                score++;
            }
        });
    }

    return (
      <Accordion type="multiple" defaultValue={['youtube', 'quiz']} className="w-full">
        {/* YouTube Suggestions */}
        <AccordionItem value="youtube">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Youtube className="h-6 w-6 text-red-500" />
              Recommended Videos
            </div>
          </AccordionTrigger>
          <AccordionContent className="pl-2 space-y-4">
            {youtubeSuggestions.map((video, index) => (
              <Card key={index} className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                     <div className="flex justify-between items-start">
                         <div>
                            <p className="font-semibold">{video.title}</p>
                            <p className="text-sm text-muted-foreground italic">"{video.description}"</p>
                         </div>
                        <Button asChild variant="ghost" size="sm">
                             <Link href={video.url} target="_blank">
                                Watch <Youtube className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                     </div>
                  </CardContent>
              </Card>
            ))}
          </AccordionContent>
        </AccordionItem>
        
        {/* Quiz Section */}
        <AccordionItem value="quiz">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500" />
              Knowledge Check Quiz
            </div>
          </AccordionTrigger>
          <AccordionContent className="pl-2 space-y-6">
            {quiz.map((q, index) => {
              const isCorrect = submitted && selectedAnswers[index] === q.answer;
              const isIncorrect = submitted && selectedAnswers[index] && selectedAnswers[index] !== q.answer;

              return (
                <div key={index}>
                  <p className="font-medium mb-2">{index + 1}. {q.question}</p>
                  <RadioGroup 
                    value={selectedAnswers[index]}
                    onValueChange={(value) => handleAnswerChange(index, value)}
                    disabled={submitted}
                  >
                    {q.options.map((option, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`q${index}-o${i}`} />
                        <Label htmlFor={`q${index}-o${i}`} className={cn(
                            "flex items-center gap-2",
                            submitted && q.answer === option && "text-green-600 font-bold",
                            submitted && selectedAnswers[index] === option && q.answer !== option && "text-red-600 line-through font-bold"
                        )}>
                          {option}
                          {submitted && q.answer === option && <CheckCircle className="h-4 w-4" />}
                          {submitted && selectedAnswers[index] === option && q.answer !== option && <XCircle className="h-4 w-4" />}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              );
            })}

            {!submitted ? (
                 <Button onClick={handleSubmitQuiz} className="w-full">Submit Quiz</Button>
            ): (
                <Card className="mt-4 bg-secondary">
                    <CardContent className="p-4 text-center">
                        <p className="font-bold text-lg">Quiz Complete! Your score: {score}/{quiz.length}</p>
                    </CardContent>
                </Card>
            )}

          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-headline text-2xl flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          AI Learning Assistant
        </DialogTitle>
        <DialogDescription>
          Showing suggestions for topic: <span className="font-semibold text-primary">{topicName}</span>
        </DialogDescription>
      </DialogHeader>
      <div className="py-4 min-h-[24rem]">
        {renderContent()}
      </div>
    </>
  );
}
