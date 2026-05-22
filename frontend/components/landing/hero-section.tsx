import Text3DFlip from "@/components/ui/text-3d-flip"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import Link from "next/link"
export const HeroSection = () => {
    return(
        <div className="flex justify-center items-center flex-col h-[90%]  w-full mt-10">
                <h1
      className=" font-serif text-2xl sm:text-5xl md:text-[60px]"
    
    >
     التعلم السليم يتطلب الأدوات المناسبة
    </h1>
    <div className="w-[90%] sm:w-full z-50 flex justify-center items-center flex-col">

    <p className="text-gray-400 mt-5  ">
تطبيق مجاني بالكامل، يمكنك الآن البدء بتعلم أي شيء في بيئة ذكية ومركزة.    </p>
    </div>

   <Link dir="ltr" href={"/auth"}>
     <InteractiveHoverButton className="mt-4">البدا الان</InteractiveHoverButton>
   </Link>
        </div>
    )
}