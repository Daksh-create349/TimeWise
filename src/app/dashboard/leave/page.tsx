"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Send, CalendarOff, Upload, History } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/cn"
import { isDateRange } from "@/lib/utils"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const initialLeaveHistory = [
  { id: 1, type: "Medical", from: new Date("2024-07-10"), to: new Date("2024-07-12"), reason: "Viral fever and doctor advised rest.", status: "Approved" },
  { id: 2, type: "Family Emergency", from: new Date("2024-05-20"), to: new Date("2024-05-21"), reason: "Urgent family matter to attend to.", status: "Approved" },
  { id: 3, type: "Personal", from: new Date("2024-04-01"), to: new Date("2024-04-01"), reason: "Attending a cousin's wedding.", status: "Rejected" },
]

export default function RequestLeavePage() {
  const { toast } = useToast()
  const [date, setDate] = React.useState<DateRange | undefined>()
  const [leaveType, setLeaveType] = React.useState<string>()
  const [reason, setReason] = React.useState("")
  const [certificate, setCertificate] = React.useState<File | null>(null)
  const [leaveHistory, setLeaveHistory] = React.useState(initialLeaveHistory)

  const isFormValid = () => {
    if (!leaveType || !isDateRange(date) || !reason) {
      return false
    }
    if (leaveType === "medical" && !certificate) {
      return false
    }
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid()) {
      toast({
        variant: "destructive",
        title: "Incomplete Form",
        description: "Please fill out all required fields before submitting.",
      })
      return
    }

    const newRequest = {
      id: leaveHistory.length + 1,
      type: leaveType!,
      from: date!.from!,
      to: date!.to!,
      reason: reason,
      status: "Pending",
    }

    setLeaveHistory([newRequest, ...leaveHistory])

    toast({
      title: "Leave Request Submitted",
      description: "Your request has been sent for approval and added to your history.",
    })
    
    // Reset form
    setDate(undefined)
    setLeaveType(undefined)
    setReason("")
    setCertificate(null)
    const form = e.target as HTMLFormElement
    form.reset()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <form onSubmit={handleSubmit}>
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
                  <SelectItem value="Medical">Medical Leave</SelectItem>
                  <SelectItem value="Family Emergency">
                    Family Emergency
                  </SelectItem>
                  <SelectItem value="Personal">Personal Reasons</SelectItem>
                  <SelectItem value="Event">
                    University-Sanctioned Event
                  </SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {leaveType === "Medical" && (
              <div className="space-y-2">
                <Label htmlFor="medical-certificate">
                  Upload Medical Certificate
                </Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="medical-certificate" 
                    type="file" 
                    required 
                    className="cursor-pointer"
                    onChange={(e) => setCertificate(e.target.files ? e.target.files[0] : null)}
                  />
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
                    disabled={(day) => day < new Date(new Date().setDate(new Date().getDate() - 1))}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Leave</Label>
              <Textarea
                id="reason"
                placeholder="Briefly explain the reason for your absence."
                rows={5}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={!isFormValid()}>
              <Send className="mr-2 h-4 w-4" />
              Submit Request
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <History className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="font-headline text-xl">Leave History</CardTitle>
              <CardDescription>A record of your past leave requests.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveHistory.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.type}</TableCell>
                  <TableCell>
                    {format(request.from, "MMM d, yyyy")} - {request.to ? format(request.to, "MMM d, yyyy") : ""}
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate text-muted-foreground" title={request.reason}>
                    {request.reason}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={
                        request.status === "Approved" ? "secondary" : 
                        request.status === "Rejected" ? "destructive" : 
                        "outline"
                    } className={
                        request.status === 'Approved' ? 'bg-green-600/10 text-green-700 border-green-600/20' : ''
                    }>
                        {request.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
