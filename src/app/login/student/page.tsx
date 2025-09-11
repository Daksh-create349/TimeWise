
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, User, Mail, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function StudentLoginPage() {
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
              <h1 className="text-4xl font-bold font-headline">Welcome Back, Student!</h1>
              <p className="text-muted-foreground mt-2">Access your courses, assignments, and track your academic progress all in one place.</p>
            </div>
            
            <Card className="overflow-hidden rounded-xl shadow-lg">
                <Image
                  src="https://i.pinimg.com/736x/8b/85/e6/8b85e627bc90a5336114a407dff9b6f3.jpg"
                  alt="University students walking on campus"
                  width={800}
                  height={600}
                  className="object-cover"
                  data-ai-hint="university students"
                />
            </Card>

            <div className="grid grid-cols-3 gap-4">
              <InfoCard value="24/7" label="Access" />
              <InfoCard value="100+" label="Courses" />
              <InfoCard value="AI" label="Powered" />
            </div>
          </div>

          {/* Right Column (Login Form) */}
          <div>
            <Card className="w-full max-w-md mx-auto shadow-2xl rounded-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Student Login</CardTitle>
                <CardDescription>Enter your credentials to access your student dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-id" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Student ID
                    </Label>
                    <Input id="student-id" placeholder="Enter your student ID" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    <Input id="email" type="email" placeholder="student@university.edu" required />
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
                      <Checkbox id="remember-me" />
                      <Label htmlFor="remember-me" className="text-sm font-normal">Remember me</Label>
                    </div>
                    <Link href="#" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  <Link href="/dashboard" passHref>
                    <Button type="submit" className="w-full font-semibold text-base py-6">
                        Sign In to Dashboard
                    </Button>
                  </Link>

                  <div className="text-center text-sm text-muted-foreground pt-4">
                    Don't have an account?{' '}
                    <Link href="#" className="text-primary hover:underline font-medium">
                      Contact Administrator
                    </Link>
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

function InfoCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white/50 border border-gray-200 rounded-lg p-4 text-center shadow">
      <p className="text-2xl font-bold text-primary">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
