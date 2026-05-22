"use client";

import { HugeiconsIcon } from '@hugeicons/react'
import { StudyDeskIcon, Youtube, TimeHalfPassIcon, Book01Icon, Brain02Icon, WhiteboardIcon } from '@hugeicons/core-free-icons'
import BackgroundVideo from './ui/background-image';

export default function IntegrationsSection() {
  const orbitIcons = [
    { icon: StudyDeskIcon, angle: 0 },
    { icon: Youtube, angle: 45 },
    { icon: TimeHalfPassIcon, angle: 90 },
    { icon: Book01Icon, angle: 135 },
    { icon: Brain02Icon, angle: 180 },
    { icon: WhiteboardIcon, angle: 225 },
  ]

  return (
    <section className="relative mt-0 overflow-hidden w-full">

      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 w-full" />
    <BackgroundVideo playbackId="8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q"/>

      <div className="relative z-10 py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative mx-auto  flex h-80 w-full items-center justify-center md:h-96">
            <div className="relative z-20 backdrop-blur-lg  flex h-24 w-24 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm shadow-xl ring-1 ring-black/10 dark:ring-white/20">
              <div className="text-xl font-borelative mt-0  overflow-hiddenld tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Endline
              </div>
            </div>

            <div className="absolute inset-0 animate-[spin_20s_linear_infinite] ">
              {orbitIcons.map((item, idx) => {
                const angle = (idx * 360) / orbitIcons.length
                const radius = 140
                return (
                  <div
                    key={idx}
                    className="absolute  left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`,
                    }}
                  >
                    <div className="flex h-12 w-12  backdrop-blur-lg  items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm shadow-md ring-1 ring-black/10 dark:ring-white/20 transition-all duration-300 hover:scale-110 hover:shadow-glow">
                      <HugeiconsIcon icon={item.icon} className="h-6 w-6" />
                    </div>
                  </div>
                )
              })}
            </div>

            <style jsx>{`
              @media (min-width: 768px) {
                .animate-spin div {
                  transform: rotate(var(--angle)) translate(180px) rotate(calc(-1 * var(--angle)));
                }
              }
            `}</style>
          </div>

          <div className="mx-auto backdrop-blur-xl rounded-xl p-4 mt-12 max-w-lg space-y-6 text-center relative z-50">
            <h2 className="text-balance text-3xl text-white drop-shadow-lg md:text-4xl">
             كل الأدوات التي تحتاجها
            </h2>
            <p className="text-white/90 drop-shadow-md">
تم تصميم وبرمجة كل شيء لخلق بيئة متكاملة للتركيز، والدراسة، والتعلم            </p>
          </div>
        </div>
      </div>
    </section>
  )
}