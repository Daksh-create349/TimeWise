import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import MainNav from "./main-nav";
import { UserNav } from "./user-nav";
import WelcomeBanner from "./dashboard/welcome-banner";
import Logo from "./logo";

export default function Header() {
  return (
    <header className="sticky top-0 flex h-auto items-center gap-4 border-b bg-background px-4 md:px-6 z-30 py-4">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Link
            href="/dashboard"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
            <Logo className="h-6 w-6" />
            <span className="sr-only">TimeWise</span>
            </Link>
        </nav>
        <Sheet>
            <SheetTrigger asChild>
            <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
            >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
            </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <MainNav isMobile={true} />
            </SheetContent>
        </Sheet>
        <div className="flex w-full items-center justify-between gap-4 md:ml-auto">
            <div className="w-full">
              <WelcomeBanner />
            </div>
            <UserNav />
        </div>
    </header>
  );
}
