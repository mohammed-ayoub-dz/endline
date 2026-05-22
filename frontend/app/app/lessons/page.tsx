"use client";

import BackgroundVideo from "@/components/ui/background-image";
import { GooeyInput } from "@/components/ui/gooey-input";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Lessons = () => {
  const { user, isLoading } = useAuth(); 
  const router = useRouter();
  const [search , setSearch] = useState("");

  useEffect(() => {

    if (!isLoading && !user) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);
const handleSearch = (text: string) => {
    router.push(`/app/lessons/s?q=${encodeURIComponent(text)}`);
  };
    return ( 
        <div className="h-[90vh] w-full flex justify-center items-center flex-col" dir="ltr">
            
           <div className="text-5xl relative z-50 backdrop-blur-xl rounded-xl p-4 mb-5 font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent ">
         ماذا تريد ان تتعلم؟ 
        </div>
            <GooeyInput  placeholder="في ماذا تفكر؟" gooeyBlur={3} onSearch={handleSearch} />
            
        </div>
    )
}

export default Lessons;