
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  BookOpen,
  Settings,
  Calendar,
  FileText,
  BotMessageSquare,
  CreditCard,
  CalendarOff,
  ShieldAlert,
  Users,
  BookCheck,
  BarChart3,
  Bell,
} from 'lucide-react';

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/cn';
import { UserNav } from './user-nav';
import Logo from './logo';

interface MainNavProps {
  isMobile?: boolean;
}

export default function MainNav({ isMobile = false }: MainNavProps) {
  const pathname = usePathname();
  const isFacultyPage = pathname.startsWith('/dashboard/faculty');

  const studentMenuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/dashboard/timetable', label: 'Timetable', icon: Calendar },
    { href: '/dashboard/courses', label: 'Courses', icon: BookOpen },
    { href: '/dashboard/assignments', label: 'Assignments', icon: FileText },
    { href: '/dashboard/gradebook', label: 'Gradebook', icon: BookCheck },
    { href: '/dashboard/fees', label: 'Fees', icon: CreditCard },
    { href: '/dashboard/leave', label: 'Leave Request', icon: CalendarOff },
    { href: '/dashboard/complaints', label: 'Complaints', icon: ShieldAlert },
    { href: '/dashboard/ai-suggester', label: 'AI Suggester', icon: BotMessageSquare },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
  ];
  
  const facultyMenuItems = [
    { href: '/dashboard/faculty', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/dashboard/faculty/user-management', label: 'User Management', icon: Users },
    { href: '/dashboard/faculty/assignments', label: 'Assignments', icon: FileText },
    { href: '/dashboard/faculty/timetable', label: 'AI Timetable', icon: Calendar },
    { href: '/dashboard/faculty/notifications', label: 'Notifications', icon: Bell },
    { href: '/dashboard/faculty/reports', label: 'Reports', icon: BarChart3 },
    { href: '/dashboard/faculty/profile', label: 'Profile', icon: User },
  ];

  const menuItems = isFacultyPage ? facultyMenuItems : studentMenuItems;

  const navContent = (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo />
          <span className="text-xl font-headline font-semibold">TimeWise</span>
        </div>
      </SidebarHeader>

      <SidebarMenu>
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={item.exact ? pathname === item.href : pathname.startsWith(item.href) && !item.exact}
              tooltip={item.label}
            >
              <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
         {!isFacultyPage && (
          <SidebarMenuItem>
             <SidebarMenuButton
              asChild
              isActive={pathname.startsWith('/dashboard/faculty')}
              tooltip="Faculty Dashboard"
            >
              <Link href="/dashboard/faculty">
                <Users />
                <span>Faculty View</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
      
      <SidebarFooter className="mt-auto">
        <SidebarSeparator />
         <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {!isMobile && (
             <div className="group-data-[collapsible=icon]:hidden px-2">
                <UserNav isSidebar={true} />
            </div>
        )}
      </SidebarFooter>
    </>
  );

  if (isMobile) {
    return <nav className="flex h-full flex-col">{navContent}</nav>;
  }

  return navContent;
}
