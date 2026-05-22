"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { Music, Play } from "@hugeicons/core-free-icons";
import { soundsList, Sound } from "./sounds";
import { getYouTubeId } from "@/lib/youtube";

interface SoundSelectorDialogProps {
  onSelectSound: (sound: Sound) => void;
  children: React.ReactNode;
}

export function SoundSelectorDialog({ onSelectSound, children }: SoundSelectorDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (sound: Sound) => {
    onSelectSound(sound);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-purple-900 border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-white">اختر صوتاً خلفياً</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {soundsList.map((sound) => {
            const videoId = getYouTubeId(sound.url);
            const thumbnail = sound.thumbnail || (videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : "/placeholder.jpg");
            return (
              <Card
                key={sound.id}
                className="group cursor-pointer transition-all hover:scale-105 hover:shadow-xl bg-white/10 border-white/20 hover:border-orange-400/50"
                onClick={() => handleSelect(sound)}
              >
                <CardContent className="p-4 flex gap-4 items-center">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={thumbnail} alt={sound.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <HugeiconsIcon icon={Play} className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate">{sound.title}</h4>
                    <p className="text-xs text-white/60 truncate">{sound.description}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-white/70 group-hover:text-white">
                    <HugeiconsIcon icon={Music} className="h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}