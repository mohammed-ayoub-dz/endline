"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CustomYouTubePlayer } from "@/components/ui/video-player";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { PomodoroTimer } from "@/components/ui/pomodoro-timer";


export default function FullScreenVideoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const videoId = searchParams.get("id");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log(videoId)
    if (!videoId) {
      setError("لم يتم توفير معرف الفيديو");
      setLoading(false);
      return;
    }

    setLoading(false);
  }, [videoId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
       <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-4 text-white">
        <p className="text-red-400">{error || "الفيديو غير موجود"}</p>
        <Button variant="outline" onClick={() => router.back()}>
          العودة
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center w-full h-full">
        <CustomYouTubePlayer url={`${videoId}`} />
      </div>
      <PomodoroTimer />
    </div>
  );
}