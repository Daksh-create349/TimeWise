"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Send, CalendarOff, Upload } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"

export default function RequestLeavePage() {
  const { toast } = useToast()
  const [date, setDate] = React.useState<DateRange | undefined>()
  const [leaveType, setLeaveType] = React.useState<string>()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Leave Request Submitted",
      description: "Your request has been sent to the administration for approval.",
    })
    setDate(undefined)
    setLeaveType(undefined)
    // Here you would typically also clear other form fields
    const form = e.target as HTMLFormElement;
    form.reset();
  }

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <CalendarOff className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="font-headline text-2xl">
                  Request Leave of Absence
                </CardTitle>
                <CardDescription>
                  Submit a formal request for leave. Please provide all necessary
                  details for approval.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="leave-type">Type of Leave</Label>
              <Select required value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger id="leave-type">
                  <SelectValue placeholder="Select a leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medical">Medical Leave</SelectItem>
                  <SelectItem value="family-emergency">
                    Family Emergency
                  </SelectItem>
                  <SelectItem value="personal">Personal Reasons</SelectItem>
                  <SelectItem value="event">
                    University-Sanctioned Event
                  </SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {leaveType === "medical" && (
              <div className="space-y-2">
                <Label htmlFor="medical-certificate">
                  Upload Medical Certificate
                </Label>
                <div className="flex items-center gap-2">
                  <Input id="medical-certificate" type="file" required className="cursor-pointer"/>
                </div>
                <p className="text-xs text-muted-foreground">
                  Please upload a PDF or image of your medical certificate.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="leave-dates">Start & End Dates</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="leave-dates"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Leave</Label>
              <Textarea
                id="reason"
                placeholder="Briefly explain the reason for your absence. Attach any supporting documents if necessary."
                rows={5}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              <Send className="mr-2 h-4 w-4" />
              Submit Request
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}