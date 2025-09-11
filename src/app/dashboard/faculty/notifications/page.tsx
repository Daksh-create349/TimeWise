"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, BellRing, Settings } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="font-headline text-2xl">Notifications</CardTitle>
                <CardDescription>
                  Your recent alerts and updates.
                </CardDescription>
              </div>
            </div>
            <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Notification Settings</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-16">
            <BellRing className="mx-auto h-12 w-12" />
            <p className="mt-4">
              No new notifications. You're all caught up!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
