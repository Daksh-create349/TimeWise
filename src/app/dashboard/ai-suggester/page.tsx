"use client";

import { useFormState, useFormStatus } from "react-dom";
import { getCourseSuggestions } from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BotMessageSquare, Loader2, Sparkles } from "lucide-react";
import AiSuggestionResult from "@/components/ai-suggestion-result";

const initialState = {
  data: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Getting Suggestions...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Get Suggestions
        </>
      )}
    </Button>
  );
}

export default function AiSuggesterPage() {
  const [state, formAction] = useFormState(getCourseSuggestions, initialState);

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <BotMessageSquare className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="font-headline text-2xl">AI Course Suggester</CardTitle>
              <CardDescription>
                Let our AI assistant help you find the right path.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">
                What course topic, project idea, or career path are you interested in?
              </Label>
              <Textarea
                id="topic"
                name="topic"
                placeholder="e.g., 'I want to build a mobile app for sustainable farming' or 'I'm interested in machine learning but don't know where to start.'"
                rows={4}
                required
              />
            </div>
            <SubmitButton />
          </form>

          {state.error && (
            <div className="mt-4 text-center text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              <p>Error: {state.error}</p>
            </div>
          )}

          {state.data && (
            <div className="mt-8">
                <AiSuggestionResult suggestions={state.data} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
