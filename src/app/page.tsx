"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, BookUser, Building, KeyRound, Mail, Shield } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Logo from '@/components/logo';

export default function LoginPage() {
  const [showSplash, setShowSplash] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {showSplash && (
        <div className="splash-screen">
          <Logo className="h-16 w-16 text-primary" />
          <h1 className="splash-title mt-4 text-4xl font-headline font-bold text-center opacity-0">
            Uniportal
          </h1>
        </div>
      )}

      <div className="relative flex min-h-screen items-center justify-center">
        <video
          className="absolute top-0 left-0 h-full w-full object-cover -z-10"
          src="https://cdn.pixabay.com/video/2021/10/05/90933-629483642_large.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-black/50 -z-10" />

        <div className="flex flex-1 items-center justify-center p-6 lg:p-8">
          <Card className="w-full max-w-sm bg-background/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-full flex justify-center mb-4">
                  <Logo className="h-12 w-12" />
              </div>
              <CardTitle className="text-3xl font-headline">Uniportal Login</CardTitle>
              <CardDescription>Access your student dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-id">Login ID</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="login-id" placeholder="your.name@university.edu" required type="email" className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                   <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="password" required type="password" placeholder="••••••••" className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="university">University</Label>
                  <Select>
                    <SelectTrigger id="university">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Select your university" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uni-a">State University</SelectItem>
                      <SelectItem value="uni-b">Metropolitan College</SelectItem>
                      <SelectItem value="uni-c">Institute of Technology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" asChild>
                  <Link href="/dashboard">LOGIN <ArrowRight className="ml-2" /></Link>
                </Button>
              </form>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2">
                 <Button variant="outline">
                    <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                    Sign in with Google
                </Button>
                <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline">
                        <BookUser className="mr-2" /> Student Login
                    </Button>
                    <Button variant="outline">
                        <Shield className="mr-2" /> Staff Login
                    </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
