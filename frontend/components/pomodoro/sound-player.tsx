// components/pomodoro/sound-player.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack,
  Music,
  ListMusic,
} from "@hugeicons/core-free-icons";
import { getYouTubeId } from "@/lib/youtube";
import { soundsList, Sound } from "./sounds";
import { Backlight } from "../ui/backlight";

interface SoundPlayerProps {
  onMessage?: (msg: { type: string; text: string }) => void;
}

export function SoundPlayer({ onMessage }: SoundPlayerProps) {
  const [selectedSound, setSelectedSound] = useState<Sound | null>(null);
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoId = selectedSound ? getYouTubeId(selectedSound.url) : null;
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (isPlaying && player) {
      intervalRef.current = setInterval(() => {
        try {
          const time = player.getCurrentTime();
          setCurrentTime(time);
        } catch (e) {}
      }, 250);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, player]);


  const onPlayerReady = (event: { target: YouTubePlayer }) => {
    const ytPlayer = event.target;
    setPlayer(ytPlayer);
    setDuration(ytPlayer.getDuration());
    ytPlayer.setVolume(volume);
    if (isMuted) ytPlayer.mute();
  };

  const onStateChange = (event: { data: number }) => {
    setIsPlaying(event.data === 1);
  };


  const togglePlay = () => {
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  const handleSeek = (value: number[]) => {
    if (!player) return;
    const newTime = value[0];
    player.seekTo(newTime, true);
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVol = value[0];
    setVolume(newVol);
    if (player) {
      player.setVolume(newVol);
      if (newVol === 0) {
        setIsMuted(true);
        player.mute();
      } else {
        if (isMuted) {
          setIsMuted(false);
          player.unMute();
        }
      }
    }
  };

  const toggleMute = () => {
    if (!player) return;
    if (isMuted) {
      player.unMute();
      setIsMuted(false);
      setVolume((prev) => (prev === 0 ? 50 : prev));
      player.setVolume(volume === 0 ? 50 : volume);
    } else {
      player.mute();
      setIsMuted(true);
    }
  };

  const skipBack = () => {
    if (!player) return;
    const newTime = Math.max(0, currentTime - 10);
    player.seekTo(newTime, true);
    setCurrentTime(newTime);
  };

  const skipForward = () => {
    if (!player) return;
    const newTime = Math.min(duration, currentTime + 10);
    player.seekTo(newTime, true);
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;


  const handleSelectSound = (sound: Sound) => {
    setSelectedSound(sound);
    setDialogOpen(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setPlayer(null);
    onMessage?.({ type: "success", text: `تم اختيار: ${sound.title}` });
  };


  const opts = {
    height: "1",
    width: "1",
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      iv_load_policy: 3,
    },
  };
const [shuffledSounds, setShuffledSounds] = useState<Sound[]>(soundsList);

useEffect(() => {
  if (dialogOpen) {
    const shuffled = [...soundsList];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setShuffledSounds(shuffled);
  }
}, [dialogOpen]);

  return (
    <div className=" backdrop-blur-md rounded-3xl p-6 border border-white/20 scrollbar-hide">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <HugeiconsIcon icon={Music} className="h-5 w-5" />
          الصوتيات الخلفية
        </h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <HugeiconsIcon icon={ListMusic} className="h-4 w-4" />
              اختيار صوت
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto  border-white/20">
            <DialogHeader className="scrollbar-hide">
              <DialogTitle className="text-2xl font-bold text-center text-white">
                اختر صوت 
              </DialogTitle>
            </DialogHeader >
            <div className="grid grid-cols-1  gap-4 py-4 scrollbar-hide">
              {shuffledSounds.map((sound) => {
                const vidId = getYouTubeId(sound.url);
                const thumbnail =
                  sound.thumbnail || (vidId ? `https://img.youtube.com/vi/${vidId}/mqdefault.jpg` : "/placeholder.jpg");
                return (
                  <Card
                    key={sound.id}
                    className="group cursor-pointer transition-all hover:scale-105 hover:shadow-xl bg-white/10 border-white/20 hover:border-orange-400/50"
                    onClick={() => handleSelectSound(sound)}
                  >
                    <CardContent className="p-4 flex gap-4 items-center">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={thumbnail}
                          alt={sound.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <HugeiconsIcon icon={Play} className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white truncate">{sound.title}</h4>
                        <p className="text-xs text-white/60 truncate">{sound.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/70 group-hover:text-white"
                      >
                        <HugeiconsIcon icon={Music} className="h-5 w-5" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>


     {!selectedSound ? (
          <div className="text-center py-8 text-white/40">
            <HugeiconsIcon icon={Music} className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>لم يتم اختيار أي صوت بعد</p>
            <p className="text-sm">انقر على "اختيار صوت" لبدء تشغيل الموسيقى</p>
          </div>
        ) : (
              <>
                      <Backlight blur={40} className="w-full ">
      <div 
        className="relative rounded-lg overflow-hidden "
        style={{
          backgroundImage: `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b  from-black/70 via-black/50 to-black/80 backdrop-blur-[2px]" />


        <div className="relative z-10 flex flex-col justify-between  p-6">

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-8">

              <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/20">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xl font-bold text-white truncate">{selectedSound.title}</h4>
                <p className="text-sm text-white/60 truncate">{selectedSound.description}</p>
              </div>
            </div>
          </div>


          <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">

            <div className="mb-8 flex justify-center">
              <div className="w-48 h-48 rounded-2xl shadow-2xl overflow-hidden border-2 border-white/20">
                <img
                  src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                  alt={selectedSound.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>


            <div className="mb-6">
              <div className="flex justify-between text-sm text-white/70 mb-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div className="relative h-2 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                <div
                  className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>


            <div className="flex items-center justify-center gap-6 mb-8" dir="ltr">
              <Button
                variant="ghost"
                size="icon"
                onClick={skipBack}
                className="text-white/70 hover:text-white hover:bg-white/10 w-12 h-12 rounded-full"
              >
                <HugeiconsIcon icon={SkipBack} className="h-6 w-6" />
              </Button>
              
              <Button
                onClick={togglePlay}
                variant="secondary"
                size="icon"
                className="h-16 w-16 rounded-full 0 hover:from-orange-500 hover:to-pink-600 shadow-lg transition-all duration-300 hover:scale-105"
              >
                {isPlaying ? (
                  <HugeiconsIcon icon={Pause} className="h-8 w-8 text-white" />
                ) : (
                  <HugeiconsIcon icon={Play} className="h-8 w-8 text-white ml-0.5" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={skipForward}
                className="text-white/70 hover:text-white hover:bg-white/10 w-12 h-12 rounded-full"
              >
                <HugeiconsIcon icon={SkipForward} className="h-6 w-6" />
              </Button>
            </div>


            <div className="flex items-center gap-3 px-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                {isMuted || volume === 0 ? (
                  <HugeiconsIcon icon={VolumeX} className="h-5 w-5" />
                ) : (
                  <HugeiconsIcon icon={Volume2} className="h-5 w-5" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="flex-1"
              />
            </div>
          </div>

          <div className="flex-1" />
        </div>
      </div>                   
              </Backlight>
     

      <div className="fixed -top-full -left-full w-1 h-1 overflow-hidden opacity-0 pointer-events-none">
        <YouTube
          videoId={videoId as string}
          opts={opts}
          onReady={onPlayerReady}
          onStateChange={onStateChange}
        />
      </div>
    </>
        )}
    </div>
  );
}