'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { API } from '@/lib/api';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { Play, Search, SearchCode, TeacherIcon } from '@hugeicons/core-free-icons';
import { Loader } from '@/components/ui/loader';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Backlight } from '@/components/ui/backlight';
import { CustomYouTubePlayer } from '@/components/ui/video-player';


interface Video {
  id: number;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [video , setVideo] = useState<{title : string , description : string , url : string , thumbnail : string }>({
    title:"",
    description:"",
    url : "",
    thumbnail : "",
  })

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await API.search(searchQuery);
      console.log(data);
      setResults(data.results || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'حدث خطأ أثناء البحث');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery, performSearch]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!query.trim()) return;
  try {
    await API.saveVideo({
      title: video.title,
      description: video.description,
      url: video.url,
      thumbnail: video.thumbnail || getYouTubeThumbnail(video.url),
      subjectId: 0,
    });
  } catch (err) {
    console.error("Failed to save video", err);
  } finally {
    console.log("نقل اصفحة")
    router.push(`/app/lessons/watch?id=${encodeURIComponent(video.url)}`);
  }
};

  const getYouTubeThumbnail = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    if (match && match[1]) {
      return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
    }
    return '/placeholder-video.jpg';
  };


  return (
    <div className="container mx-auto py-8 px-4 md:py-12 md:px-6" dir="rtl">
      <div className="max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">البحث في الدروس</h1>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <HugeiconsIcon icon={Search} className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="ابحث عن درس... (مثال: دوال، رياضيات، نورالدين)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-9"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading && <Loader />}
            <HugeiconsIcon icon={SearchCode}/>
          </Button>
        </form>
      </div>

      <div className="max-w-6xl mx-auto">
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <Button variant="outline" onClick={() => performSearch(query)} className="mt-4">
              إعادة المحاولة
            </Button>
          </div>
        )}

        {!loading && !error && results.length === 0 && query && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">لم يتم العثور على نتائج لـ "{query}"</p>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <>
            <p className="mb-4 text-muted-foreground">
              {results.length} نتيجة لـ "{query}"
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((video) => (
                <Dialog>
  <DialogTrigger>
    <Card key={video.id} onClick={() => {
      setVideo({
        title : video.title,
        description : video.description,
        url : video.url,
        thumbnail : video.thumbnail,
      });
    }} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative aspect-video bg-muted rounded-lg">
                      <img
                        src={video.thumbnail || getYouTubeThumbnail(video.url)}
                        alt={video.title}
                        className="object-cover w-full h-full rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-video.jpg';
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
                        {video.description || 'لا يوجد وصف'}
                      </p>
                    </CardContent>
                    <CardFooter className="border-t pt-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <HugeiconsIcon icon={TeacherIcon} className="h-3 w-3" />
                        <span>{video.description}</span>
                      </div>
                    </CardFooter>
                 
                </Card>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>
        {video.title}
      </DialogTitle>
      <DialogDescription>
        <Backlight blur={40} className="w-full ">
          <CustomYouTubePlayer url={video.url}  className='h-[25vh]'/>

        </Backlight>
        
          <Button  onClick={handleSubmit} className='mt-4 w-full' >مشاهدة المقطع</Button>
      
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
                
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}