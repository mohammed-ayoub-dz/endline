'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { HugeiconsIcon } from '@hugeicons/react';
import {  Menu } from '@hugeicons/core-free-icons';

interface DashboardHeaderProps {
  onMenuClick?: () => void;   
  userName?: string;
  userAvatar?: string;
  notificationCount?: number;
}

export function DashboardHeader({
  onMenuClick,
  userName = "أحمد محمد",
  userAvatar = "",
  notificationCount = 3,
}: DashboardHeaderProps) {

  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          {onMenuClick ? (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onMenuClick}
            >
                <HugeiconsIcon icon={Menu} />
              <span className="sr-only">فتح القائمة</span>
            </Button>
          ) : (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                                 <HugeiconsIcon icon={Menu} />

                  <span className="sr-only">فتح القائمة</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] sm:w-[280px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <span className="text-lg font-bold">Endline</span>
                </nav>
              </SheetContent>
            </Sheet>
          )}

          <div className="flex justify-between items-center gap-2 w-full">
             <div className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Endline
        </div>
          </div>
        </div>
      </div>
    </header>
  );
}