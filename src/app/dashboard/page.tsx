import AIPromoCard from "@/components/dashboard/ai-promo-card";
import AssignmentsCard from "@/components/dashboard/assignments-card";
import AttendanceCard from "@/components/dashboard/attendance-card";
import TimetableCard from "@/components/dashboard/timetable-card";
import WelcomeBanner from "@/components/dashboard/welcome-banner";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4">
      <WelcomeBanner />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4 space-y-4">
            <TimetableCard />
            <AssignmentsCard />
        </div>
        <div className="lg:col-span-3 space-y-4">
            <AttendanceCard />
            <AIPromoCard />
        </div>
      </div>
    </div>
  )
}
