'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface CustomYouTubePlayerProps {
  url: string; 
  className?: string;
}

export function CustomYouTubePlayer({ url, className }: CustomYouTubePlayerProps) {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const getVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getVideoId(url);

  const startProgressInterval = useCallback(() => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    progressInterval.current = setInterval(() => {
      if (player) {
        setCurrentTime(player.getCurrentTime());
      }
    }, 250);
  }, [player]);

  const stopProgressInterval = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  }, []);

  const onReady = (event: YouTubeEvent) => {
    const ytPlayer = event.target;
    setPlayer(ytPlayer);
    setDuration(ytPlayer.getDuration());
    setVolume(ytPlayer.getVolume());
    setIsMuted(ytPlayer.isMuted());
  };

  const onStateChange = (event: YouTubeEvent) => {
    const state = event.data;
    if (state === 1) { 
      setIsPlaying(true);
      startProgressInterval();
    } else {
      setIsPlaying(false);
      stopProgressInterval();
    }
  };

  useEffect(() => {
    return () => stopProgressInterval();
  }, [stopProgressInterval]);

  const handlePlayPause = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); 
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
  };

  const handleSeek = (value: number[]) => {
    if (player) {
      player.seekTo(value[0], true);
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (player) {
      player.setVolume(newVolume);
      if (newVolume === 0) {
        player.mute();
        setIsMuted(true);
      } else {
        player.unMute();
        setIsMuted(false);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (player) {
      if (isMuted) {
        player.unMute();
        setIsMuted(false);
        if (volume === 0) setVolume(30); 
      } else {
        player.mute();
        setIsMuted(true);
      }
    }
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const container = document.getElementById('youtube-container');
    if (!container) return;
    if (!isFullscreen) {
      if (container.requestFullscreen) container.requestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2500);
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  if (!videoId) {
    return <div className="text-red-500">Invalid YouTube URL</div>;
  }

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      iv_load_policy: 3,
      fs: 0,
      autohide: 1,
      playsinline: 1,
      loop: 1,
      playlist: videoId,
      origin: typeof window !== 'undefined' ? window.location.origin : '',
    },
  };

  return (
 <div
  id="youtube-container"
  className={cn(
    "relative w-full h-[90vh] bg-black overflow-hidden group", 
    className
  )}
  onMouseMove={handleMouseMove}
  onMouseLeave={() => setShowControls(true)}
>

  <div className="absolute inset-0 w-full h-full z-10">
    <YouTube
      videoId={videoId}
      opts={{
        ...opts,
        playerVars: { ...opts.playerVars, autoplay: 1 } 
      }}
      onReady={onReady}
      onStateChange={onStateChange}
      className="w-full h-full"
      iframeClassName="w-full h-full border-0" 
      
    />
  </div>
    

  <div
    className={cn(
      "absolute inset-0 z-20 flex flex-col justify-between  duration-300",
      showControls ? "opacity-50" : "opacity-0 "
    )}
  >

    <div className="flex justify-end p-4">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-white hover:bg-white/20"
        onClick={toggleFullscreen}
      >
        {isFullscreen ? <HugeiconsIcon icon={Minimize} /> : <HugeiconsIcon icon={Maximize} />}
      </Button>
    </div>


    <div className="p-4 space-y-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent">

      <div className="relative w-full" onClick={(e) => e.stopPropagation()}>
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          className="cursor-pointer"
        />
      </div>
      

      <div className="flex items-center justify-between gap-2 text-sm text-white">
        <div className="flex items-center gap-4">

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={(e) => handlePlayPause(e)}
          >
            {isPlaying ? <HugeiconsIcon icon={Pause} /> : <HugeiconsIcon icon={Play} />}
          </Button>
          

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={toggleMute}
            >
              {isMuted || volume === 0 ? <HugeiconsIcon icon={VolumeX} /> : <HugeiconsIcon icon={Volume2} />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="w-20 cursor-pointer"
            />
          </div>
          

          <span className="tabular-nums select-none text-gray-200">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>


        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-white/20"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? <HugeiconsIcon icon={Minimize} /> : <HugeiconsIcon icon={Maximize} />}
        </Button>
      </div>
    </div>
  </div>
</div>
  );
}