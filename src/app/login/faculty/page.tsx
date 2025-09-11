
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, User, Mail, Lock, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function FacultyLoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to selection
        </Link>
        <main className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="text-left">
              <h1 className="text-4xl font-bold font-headline">Faculty Portal</h1>
              <p className="text-muted-foreground mt-2">Manage your courses, track student progress, and collaborate with colleagues in our comprehensive faculty dashboard.</p>
            </div>
            
            <Card className="overflow-hidden rounded-xl shadow-lg">
                <Image
                  src="https://i.pinimg.com/736x/e1/43/47/e14347894ccb2289ccb5cc9a85ccdb21.jpg"
                  alt="University professor"
                  width={800}
                  height={600}
                  className="object-cover"
                  data-ai-hint="university professor"
                />
            </Card>

            <div className="grid grid-cols-3 gap-4">
              <InfoCard title="Advanced" label="Analytics" color="text-green-500" />
              <InfoCard title="Smart" label="Grading" color="text-orange-500" />
              <InfoCard title="Real-time" label="Insights" color="text-red-500" />
            </div>
          </div>

          {/* Right Column (Login Form) */}
          <div>
            <Card className="w-full max-w-md mx-auto shadow-2xl rounded-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Faculty Access</CardTitle>
                <CardDescription>Sign in to access your teaching dashboard and administrative tools</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="employee-id" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Employee ID
                    </Label>
                    <Input id="employee-id" placeholder="Enter your employee ID" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Institutional Email
                    </Label>
                    <Input id="email" type="email" placeholder="faculty@university.edu" required />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="department" className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Department
                    </Label>
                    <Select>
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select your department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="computer-science">Computer Science</SelectItem>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="biology">Biology</SelectItem>
                        <SelectItem value="english-literature">English Literature</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                        <SelectItem value="psychology">Psychology</SelectItem>
                        <SelectItem value="business-administration">Business Administration</SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Password
                    </Label>
                    <Input id="password" type="password" placeholder="Enter your password" required />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="keep-me-signed-in" />
                      <Label htmlFor="keep-me-signed-in" className="text-sm font-normal">Keep me signed in</Label>
                    </div>
                    <Link href="#" className="text-sm text-primary hover:underline">
                      Reset password
                    </Link>
                  </div>

                  <Link href="/dashboard" passHref>
                    <Button type="submit" className="w-full font-semibold text-base py-6">
                        Access Faculty Portal
                    </Button>
                  </Link>
                  
                  <div className="text-center text-sm text-muted-foreground pt-4">
                    <p>
                        Need assistance?{' '}
                        <Link href="#" className="text-primary hover:underline font-medium">
                            Contact IT Support
                        </Link>
                    </p>
                    <p className="text-xs mt-2">
                        By signing in, you agree to the university's IT policies and terms of use.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

function InfoCard({ title, label, color }: { title: string; label: string, color: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 text-center shadow">
      <p className={`text-xl font-bold ${color}`}>{title}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
