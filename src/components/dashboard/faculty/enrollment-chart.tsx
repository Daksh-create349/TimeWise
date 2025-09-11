
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent } from "@/components/ui/card"

const data = [
  { month: "Jan", new: 2400, returning: 200 },
  { month: "Feb", new: 2650, returning: 220 },
  { month: "Mar", new: 2700, returning: 210 },
  { month: "Apr", new: 3100, returning: 250 },
  { month: "May", new: 3300, returning: 230 },
  { month: "Jun", new: 3600, returning: 240 },
]

export default function EnrollmentChart() {
  return (
    <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                    contentStyle={{
                        background: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                    }}
                />
                <Legend />
                <Bar dataKey="new" fill="#3b82f6" name="New Students" radius={[4, 4, 0, 0]} />
                <Bar dataKey="returning" fill="#16a34a" name="Returning Students" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
  )
}
