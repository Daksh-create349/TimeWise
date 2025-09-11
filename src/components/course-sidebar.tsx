
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { 
    Info, 
    BookCopy, 
    ClipboardList, 
    ListTodo, 
    Package, 
    ClipboardCheck, 
    CheckCircle, 
    Award,
    Target
} from "lucide-react";

export const menuItems = [
    { name: "Basic Info", icon: Info },
    { name: "Syllabus", icon: BookCopy },
    { name: "Course Topics", icon: ClipboardList, default: true },
    { name: "Lesson Plan", icon: ListTodo },
    { name: "Course Contents", icon: Package },
    { name: "Assignments", icon: ClipboardCheck },
    { name: "Attendance", icon: CheckCircle },
    { name: "Course Outcomes", icon: Award },
    { name: "Program Outcomes", icon: Target },
];

interface CourseSidebarProps {
    activeItem: string;
    setActiveItem: (item: string) => void;
}

export default function CourseSidebar({ activeItem, setActiveItem }: CourseSidebarProps) {
    return (
        <div className="space-y-2">
            {menuItems.map((item) => (
                <Button
                    key={item.name}
                    variant={activeItem === item.name ? "default" : "ghost"}
                    className={cn(
                        "w-full justify-start text-base py-6",
                        activeItem === item.name ? "bg-primary text-primary-foreground" : ""
                    )}
                    onClick={() => setActiveItem(item.name)}
                >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                </Button>
            ))}
        </div>
    );
}
