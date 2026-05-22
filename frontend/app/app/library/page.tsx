"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowBigLeft, ArrowBigRight, Play, TeacherIcon } from "@hugeicons/core-free-icons";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { API } from "@/lib/api";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Video {
  id: number;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  created_at: string;
}

function getYouTubeThumbnail(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : "/placeholder-video.jpg";
}

export default function Library() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const route = useRouter();

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const data = await API.getLibrary(); 
        setVideos(data.videos || []);
      } catch (err: any) {
        setError(err.message || "فشل تحميل المكتبة");
      } finally {
        setLoading(false);
      }
    };
    fetchLibrary();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()}>إعادة المحاولة</Button>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex h-[90vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg text-muted-foreground">مكتبتك فارغة حالياً</p>
        <p className="text-sm text-muted-foreground">ابحث عن فيديوهات وأضفها إلى مكتبتك لمشاهدتها لاحقاً</p>
        <Link href="/app/lessons">
          <Button>اذهب إلى البحث</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4" dir="rtl">
        <Button onClick={() => {
            route.back()
        }}>
            <HugeiconsIcon icon={ArrowBigRight}/>
        </Button>
      <h1 className="text-3xl font-bold mb-6">مكتبتي</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <Link href={`/app/lessons/watch?id=${encodeURIComponent(video.url)}`}>
              <div className="relative aspect-video bg-muted rounded-lg">
                <img
                  src={video.thumbnail || getYouTubeThumbnail(video.url)}
                  alt={video.title}
                  className="object-cover w-full h-full rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder-video.jpg";
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                  <HugeiconsIcon icon={Play} className="h-12 w-12 text-white fill-white" />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2 text-lg">{video.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {video.description || "لا يوجد وصف"}
                </p>
              </CardContent>
              <CardFooter className="border-t pt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <HugeiconsIcon icon={TeacherIcon} className="h-3 w-3" />
                  <span>تمت الإضافة في {new Date(video.created_at).toLocaleDateString("ar-EG")}</span>
                </div>
              </CardFooter>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}