
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building, Download, FileText, BarChart3 } from "lucide-react";
import EnrollmentChart from "@/components/dashboard/faculty/enrollment-chart";

const statsCards = [
    {
      title: "Faculty Members",
      value: "205",
      description: "95% active",
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Room Utilization",
      value: "82%",
      description: "Peak efficiency",
      icon: Building,
      color: "text-red-500",
    },
  ];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
       <div className="grid gap-6 md:grid-cols-2">
         {statsCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 text-muted-foreground ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
       </div>

        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <BarChart3 className="h-6 w-6 text-primary" />
                        <div>
                            <CardTitle className="font-headline text-xl">Enrollment Trends</CardTitle>
                            <CardDescription>Monthly student enrollment figures for the current year.</CardDescription>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            CSV
                        </Button>
                         <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            PDF
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pl-2 pr-6">
                <EnrollmentChart />
            </CardContent>
        </Card>
    </div>
  );
}
