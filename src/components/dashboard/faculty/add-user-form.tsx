
"use client";

import React from 'react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

type User = {
    name: string;
    email: string;
    role: string;
    department: string;
};

interface AddUserFormProps {
  onUserAdd: (user: User) => void;
}

export default function AddUserForm({ onUserAdd }: AddUserFormProps) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState('');
  const [department, setDepartment] = React.useState('');

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!name || !email || !role || !department) {
        toast({
            variant: "destructive",
            title: "Missing fields",
            description: "Please fill out all required fields."
        });
        return;
    }

    setIsSubmitting(true);

    const newUser = { name, email, role, department };

    setTimeout(() => {
      onUserAdd(newUser);
      toast({
        title: 'User Added',
        description: `Successfully added ${name} to the system.`,
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-headline text-2xl">
          Add New User
        </DialogTitle>
        <DialogDescription>
          Fill in the details below to create a new user account.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-6 py-4">
        <div className="space-y-2">
          <Label htmlFor="user-name">Full Name</Label>
          <Input
            id="user-name"
            placeholder="e.g., Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="user-email">Email Address</Label>
          <Input
            id="user-email"
            type="email"
            placeholder="e.g., jane.doe@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select required value={role} onValueChange={setRole}>
                    <SelectTrigger id="role">
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="faculty">Faculty</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select required value={department} onValueChange={setDepartment}>
                    <SelectTrigger id="department">
                        <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Biology">Biology</SelectItem>
                        <SelectItem value="Administration">Administration</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
        
        <DialogFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding User...
              </>
            ) : (
              'Create User Account'
            )}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
