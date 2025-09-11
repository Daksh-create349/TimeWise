
"use client";

import { Suspense } from "react";
import CourseSidebar from "@/components/course-sidebar";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
    CourseTopicsView,
    SyllabusView,
    LessonPlanView,
    CourseContentView,
    AssignmentsView,
    AttendanceView,
    CourseOutcomesView,
    BasicInfoView
} from "@/components/dashboard/courses/course-views";

function CourseDetailPageContent() {
    const searchParams = useSearchParams();
    const courseName = searchParams.get('name') || "Course";
    const courseCode = useSearchParams().get('code') || "CS101";
    const courseDescription = useSearchParams().get('description') || "A default course description.";
    const course = { name: courseName, code: courseCode, description: courseDescription };
    
    const [activeView, setActiveView] = useState("Course Topics");
    
    const renderContent = () => {
        switch (activeView) {
            case "Basic Info":
                return <BasicInfoView course={course} />;
            case "Syllabus":
                return <SyllabusView courseName={courseName} />;
            case "Course Topics":
                return <CourseTopicsView courseName={courseName} />;
            case "Lesson Plan":
                return <LessonPlanView courseName={courseName} />;
            case "Course Contents":
                return <CourseContentView courseName={courseName} />;
            case "Assignments":
                return <AssignmentsView courseName={courseName} />;
            case "Attendance":
                return <AttendanceView courseName={courseName} />;
            case "Course Outcomes":
                return <CourseOutcomesView courseName={courseName} />;
            case "Program Outcomes":
                return <CourseOutcomesView courseName={courseName} isProgramOutcomes />;
            default:
                return <CourseTopicsView courseName={courseName} />;
        }
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
                <CourseSidebar activeItem={activeView} setActiveItem={setActiveView} />
            </div>
            <div className="md:col-span-3">
                {renderContent()}
            </div>
        </div>
    );
}


export default function CourseDetailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CourseDetailPageContent />
        </Suspense>
    )
}
