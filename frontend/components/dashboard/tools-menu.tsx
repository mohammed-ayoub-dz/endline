'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, ArrowLeft, BookOpen, PlayCircle02FreeIcons, TimeHalfPassIcon, Video01Icon, YoutubeIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';

interface Tool {
  id: string;
  title: string;
  description: string;
  icon: any;
  href: string;
}

const tools: Tool[] = [
  {
    id: 'library',
    title: " المكتبة",
    description: "ادارة المكتبة",
    icon: YoutubeIcon,
    href: '/app/library',
    
  },
  {
    id: 'pomodoro',
    title: 'بومودورو ',
    description: ' تركيزك وأدار وقتك بتقنية البومودورو',
    icon: TimeHalfPassIcon,
    href: '/app/pomodoro',
  },
  {
    id: 'lessons',
    title: 'مشاهدة الدروس',
    description: "مشاهدة الدروس التعليمية المسجلة",
    icon: PlayCircle02FreeIcons,
    href: '/app/lessons',
  },
];

export function ToolsMenu() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
           اين تريد ان تبدأ؟
        </h2>
        <p className="-foreground mt-2 max-w-2xl mx-auto text-red-500 flex justify-center items-center flex-row gap-2">
            نسخة تجريبية <HugeiconsIcon icon={Alert}/>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card id={tool.id} className="relative h-full overflow-hidden border-0 shadow-lg  transition-all duration-300 cursor-pointer group">
              <div
                className={`absolute inset-0 opacity-0  transition-opacity duration-500 `}
              />
              
              <CardHeader className="relative z-10">
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl  transition-all duration-300 group-hover:scale-120`}
                >
                 <HugeiconsIcon icon={tool.icon}/>
                </div>
                <CardTitle className="text-xl md:text-2xl">{tool.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <Button
                  variant="outline"
                  className="w-full  transition-colors"
                  asChild
                >
                  <Link href={tool.href}>
                   بدأ
                    <HugeiconsIcon icon={ArrowLeft} className="mr-2 h-4 w-4 rtl:rotate-180" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}