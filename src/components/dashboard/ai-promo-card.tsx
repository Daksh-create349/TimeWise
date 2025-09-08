import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BotMessageSquare, ArrowRight } from "lucide-react";

export default function AIPromoCard() {
  return (
    <Card className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground overflow-hidden">
      <div className="relative p-6">
        <div className="flex items-center gap-3">
          <BotMessageSquare className="h-8 w-8" />
          <div>
            <CardTitle className="font-headline text-2xl">AI Course Suggester</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Get personalized course & career advice.
            </CardDescription>
          </div>
        </div>
        <CardContent className="p-0 pt-4">
          <p className="mb-4">
            Unsure what to study next? Our AI can analyze your academic profile to suggest courses, projects, and career paths tailored just for you.
          </p>
          <Link href="/dashboard/ai-suggester" passHref>
            <Button variant="secondary" className="w-full">
              Try It Now <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </CardContent>
        <div className="absolute -right-10 -bottom-10 h-28 w-28 text-white/10">
          <BotMessageSquare className="h-full w-full" />
        </div>
      </div>
    </Card>
  );
}
