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
} from "@/components/ui/dropdown-menu"
import { LogOut, User, CreditCard, Settings } from "lucide-react"

interface UserNavProps {
    isSidebar?: boolean;
}

export function UserNav({ isSidebar = false }: UserNavProps) {
  const triggerContent = (
    <>
        <Avatar className="h-8 w-8">
            <AvatarImage src="https://picsum.photos/seed/aj/100/100" alt="@student" data-ai-hint="student avatar" />
            <AvatarFallback>AJ</AvatarFallback>
        </Avatar>
        {isSidebar && (
            <div className="text-left">
                <p className="text-sm font-medium">Alex Johnson</p>
                <p className="text-xs text-muted-foreground">alex.j@university.edu</p>
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
            <p className="text-sm font-medium leading-none">Alex Johnson</p>
            <p className="text-xs leading-none text-muted-foreground">
              alex.j@university.edu
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
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
