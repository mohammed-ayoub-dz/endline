'use client';

import { useAuth } from '@/contexts/auth-context';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from '@/components/ui/loader';
import { ToolsMenu } from '@/components/dashboard/tools-menu';
import { GuideStep, IndependentGuideCursor } from "@/components/ui/smooth-cursor"

export default function DashboardPage() {
  const { user, isLoading } = useAuth(); 
  const router = useRouter();

  useEffect(() => {

    if (!isLoading && !user) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    setTimeout(() => {
      localStorage.setItem("learn-first-page" , "done")
    }, 17500);
  } , []) 


  if (isLoading) {
    return (
      <div className='h-screen w-full relative z-50 flex justify-center items-center flex-col'>
        <Loader />
      </div>
    );
  }
const tourSteps: GuideStep[] = [
    {
      targetId: "books",
      text: "حسنا انا هو مساعدك ،هنا تجد المكتبة تاعك لي فيها فيديوهات لي تشوفهم، نقولك سر تقدر تعدل عليها وتخصصها",
      mood: "neutral", 
    },
    {
      targetId: "pomodoro",
      text: "شوف شوف راك تسمعني  نلقاك تدخل هنا بلا ما تخلص نطفي لك البيسي انا الماوس الشرير",
      mood: "angry" 
    },
     {
      targetId: "pomodoro",
      text: "امزح فقط هههههههههههه",
      mood: "funny" 
    },
    {
      targetId: "pomodoro",
      text: "هنا سيتم نقلك الى صفحة فخمة نظيفة فيها تايمر وانت تدرس وبدون اي تشتيت",
      mood: "neutral" 
    },
    {
      targetId: "lessons",
      text: "هنا يا اخي تلقى تجميعة مقاطع تعليمية",
      mood: "neutral"
    },
       {
      targetId: "lessons",
      text: `مسكتك لا تحاول تهرب من مقاطع نور الدين الطويلة ههههههههههههههههههههههههههههه انا قاعد اتابعك يا ${user?.username}`,
      mood: "funny"
    },
  ]
  return (
    <div className="w-full h-full">
      <div className=" w-full bg-black relative overflow-hidden">
 <div
   className="absolute inset-0 z-0 pointer-events-none"
   style={{
     background: `
       radial-gradient(
         circle at top,
         rgba(255, 255, 255, 0.08) 0%,
         rgba(255, 255, 255, 0.08) 20%,
         rgba(0, 0, 0, 0.0) 60%
       )
     `,
   }}
 />
{localStorage.getItem("learn-first-page") != null ? null : <IndependentGuideCursor steps={tourSteps} delayPerTarget={3500} />}

     <ToolsMenu />
</div>

    </div>
  );
}