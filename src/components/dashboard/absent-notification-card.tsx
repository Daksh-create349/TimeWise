
"use client";

import { useTimetable } from "@/context/TimetableContext";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Megaphone } from "lucide-react";

export default function AbsentNotificationCard() {
  const { absentClasses } = useTimetable();

  if (absentClasses.length === 0) {
    return null;
  }

  return (
    <Alert variant="destructive" className="bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:text-yellow-400">
        <Megaphone className="h-4 w-4 !text-yellow-600" />
        <AlertTitle className="font-bold">Class Updates</AlertTitle>
        <AlertDescription>
            The following classes have been marked as canceled for today due to faculty absence: 
            <span className="font-semibold"> {absentClasses.join(', ')}</span>.
        </AlertDescription>
    </Alert>
  );
}
