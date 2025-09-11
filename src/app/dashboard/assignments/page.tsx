
"use client";

import AssignmentsCard from "@/components/dashboard/assignments-card";
import { AssignmentProvider } from "@/context/AssignmentContext";

export default function AssignmentsPage() {
    return (
        <AssignmentProvider>
            <AssignmentsCard />
        </AssignmentProvider>
    )
}
