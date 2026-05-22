import { Instagram, Twitter, Github, Linkedin, Mail, Heart } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer
      className="relative z-50 w-full border-t border-border/40 bg-background/70 backdrop-blur-md"
      dir="rtl"
    >
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-4">
            <div className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              محمد أيوب
            </div>
            <p className="text-sm text-muted-foreground">
              مطور ومصمم ومهندس مستقل خلف هذا المشروع
            </p>
            <div className="flex space-x-3">
              <Link
                href="https://www.instagram.com/abo_aisha27/"
                target="_blank"
                className="rounded-full p-2 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
              >
                <HugeiconsIcon icon={Instagram} className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                target="_blank"
                className="rounded-full p-2 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
              >
                <HugeiconsIcon icon={Github} className="h-5 w-5" />
              </Link>
             
            </div>
          </div>

     

          

        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 text-center sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} محمد أيوب. جميع الحقوق محفوظة.
          </p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            صنع بحب <HugeiconsIcon icon={Heart} className="h-3 w-3 text-red-500" /> 
          </p>
        </div>
      </div>
    </footer>
  );
};