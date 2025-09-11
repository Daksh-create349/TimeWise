"use client"

import * as React from "react"
import { Send } from "lucide-react"

import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { ShieldAlert } from "lucide-react"

export default function ComplaintsPage() {
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Complaint Submitted",
      description:
        "Your complaint has been registered. You will be contacted by the concerned department shortly.",
    })
    // Here you would typically also clear form fields
  }

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="font-headline text-2xl">
                  Submit a Complaint
                </CardTitle>
                <CardDescription>
                  Lodge a formal complaint regarding any issue you are facing.
                  Your feedback is valuable.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="complaint-category">Category</Label>
              <Select required>
                <SelectTrigger id="complaint-category">
                  <SelectValue placeholder="Select a complaint category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="infrastructure">
                    Infrastructure & Facilities
                  </SelectItem>
                  <SelectItem value="faculty">Faculty Related</SelectItem>
                  <SelectItem value="administrative">
                    Administrative
                  </SelectItem>
                  <SelectItem value="harassment">
                    Harassment or Ragging
                  </SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="e.g., Issue with library book availability"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description of Complaint</Label>
              <Textarea
                id="description"
                placeholder="Please provide a detailed description of the issue, including dates, names, and any other relevant information."
                rows={8}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              <Send className="mr-2 h-4 w-4" />
              Submit Complaint
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
