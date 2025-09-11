"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu"
import { LogOut, User, CreditCard, Settings, Monitor, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes";
import { useSearchParams, useRouter } from "next/navigation";

interface UserNavProps {
    isSidebar?: boolean;
}

export function UserNav({ isSidebar = false }: UserNavProps) {
  const { setTheme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get('name') || "Alex Johnson";
  const fallback = name.split(' ').map(n => n[0]).join('');
  const email = name.toLowerCase().replace(' ', '.') + "@university.edu";

  const handleLogout = () => {
    router.push('/');
  };

  const triggerContent = (
    <>
        <Avatar className="h-8 w-8">
            <AvatarImage src={`https://picsum.photos/seed/${name}/100/100`} alt={name} data-ai-hint="student avatar" />
            <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
        {isSidebar && (
            <div className="text-left">
                <p className="text-sm font-medium">{name}</p>
                <p className="text-xs text-muted-foreground">{email}</p>
            </div>
        )}
    </>
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isSidebar ? (
            <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                {triggerContent}
            </Button>
        ) : (
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                {triggerContent}
            </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </DropdownMenuItem>
           <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Settings className="mr-2 h-4 w-4" />
              <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Monitor className="mr-2 h-4 w-4" />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
