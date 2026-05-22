"use client";

import { Button } from "@/components/ui/button";
import { Github, Menu } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "التوثيق", href: "/pricig" },
    { name: "الادوات", href: "/tools" },
    { name: "المساعدة", href: "/help" },
  ];

  return (
<header className="fixed top-0 z-50 w-full backdrop-blur-lg bg-background/70 border-b border-border/40 shadow-sm transition-all">      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Endline
        </div>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="group relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-primary/60 transition-all duration-300 ease-out group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <Link href={"/auth"}>
<Button
            variant="outline"
            size="default"
            className="rounded-full border-border/50 bg-background/20 backdrop-blur-sm transition-all hover:bg-background/40"
          >
            تسجيل الدخول
          </Button>          
          </Link>
          <Button
            variant="outline"
            size="default"
            className="rounded-full border-border/50 bg-background/20 backdrop-blur-sm transition-all hover:bg-background/40"
          >
            <HugeiconsIcon icon={Github} />
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full border-border/50 bg-background/20 backdrop-blur-sm hover:bg-background/40"
              >
                <HugeiconsIcon icon={Menu} className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] backdrop-blur-lg bg-background/95 border-l border-border/40">
              <SheetHeader className="border-b border-border/40 pb-4 mb-4">
                <SheetTitle className="text-left text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Endline
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2">
                {navLinks.map((link, index) => (
                  <SheetClose asChild key={link.name}>
                    <Link
                      href={link.href}
                      className="group relative flex items-center px-3 py-2.5 text-base font-medium text-muted-foreground rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:translate-x-1"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                      <span className="absolute left-0 top-1/2 h-0 w-0.5 -translate-y-1/2 bg-primary transition-all duration-200 group-hover:h-6"></span>
                    </Link>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};