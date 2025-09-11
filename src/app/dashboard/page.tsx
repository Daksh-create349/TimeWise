import AIPromoCard from "@/components/dashboard/ai-promo-card";
import AbsentNotificationCard from "@/components/dashboard/absent-notification-card";
import AttendanceCard from "@/components/dashboard/attendance-card";
import TimetableCard from "@/components/dashboard/timetable-card";

export default function DashboardPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <AbsentNotificationCard />
        <TimetableCard />
      </div>
      <div className="space-y-6">
        <AIPromoCard />
        <AttendanceCard />
      </div>
    </div>
  )
}
