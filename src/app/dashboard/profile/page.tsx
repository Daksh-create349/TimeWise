import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div>
        <h1 className="text-3xl font-bold font-headline mb-4">Your Profile</h1>
        <Card>
            <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>This section will display your personal and academic information.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-60">
                <User className="h-16 w-16 mb-4" />
                <p>Your profile details and settings will be managed here.</p>
            </CardContent>
        </Card>
    </div>
  );
}
