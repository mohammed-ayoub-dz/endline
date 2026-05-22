"use client"

import { FC, useEffect, useState } from "react"
import { motion, useSpring, AnimatePresence } from "framer-motion"

export type CursorMood = "neutral" | "happy" | "funny" | "angry" | "excited"

export interface GuideStep {
  targetId: string      
  text: string          
  mood?: CursorMood     
}

export interface IndependentGuideCursorProps {
  steps?: GuideStep[]
  delayPerTarget?: number
  springConfig?: {
    damping: number
    stiffness: number
    mass: number
  }
}

const getMoodColor = (mood: CursorMood) => {
  switch (mood) {
    case "angry": return "#ef4444"
    case "funny": return "#eab308" 
    case "excited": return "#ec4899" 
    case "happy": return "#22c55e"  
    default: return "#ffffff"       
  }
}

const CharacterCursorSVG: FC<{ mood: CursorMood }> = ({ mood }) => {
  const fillColor = getMoodColor(mood)

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={50}
      height={54}
      viewBox="0 0 50 54"
      fill="none"
      style={{ scale: 0.6, transform: "rotate(-20deg)" }}
    >
      <g filter="url(#filter0_d_91_7928)">
        <motion.path
          d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"
          animate={{ fill: fillColor }}
          transition={{ duration: 0.3 }}
        />
        <path
          d="M43.7146 40.6933L28.5431 6.34306C27.3556 3.65428 23.5772 3.69516 22.3668 6.32755L6.57226 40.6778C5.3134 43.4156 7.97238 46.298 10.803 45.2549L24.7662 40.109C25.0221 40.0147 25.2999 40.0156 25.5494 40.1082L39.4193 45.254C42.2261 46.2953 44.9254 43.4347 43.7146 40.6933Z"
          stroke="white"
          strokeWidth={2.25825}
        />
      </g>
      <defs>
        <filter id="filter0_d_91_7928" x={0.602397} y={0.952444} width={49.0584} height={52.428} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy={2.25825} />
          <feGaussianBlur stdDeviation={2.25825} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_91_7928" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_91_7928" result="shape" />
        </filter>
      </defs>
    </svg>
  )
}

export function IndependentGuideCursor({
  steps = [],
  delayPerTarget = 3500, 
  springConfig = {
    damping: 25,
    stiffness: 140,
    mass: 1,
  },
}: IndependentGuideCursorProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [currentText, setCurrentText] = useState("")
  const [currentMood, setCurrentMood] = useState<CursorMood>("neutral")
  
  const cursorX = useSpring(0, springConfig)
  const cursorY = useSpring(0, springConfig)

  useEffect(() => {
    if (steps.length === 0) return

    cursorX.set(window.innerWidth / 2)
    cursorY.set(window.innerHeight - 80)
    
    const showTimeout = setTimeout(() => setIsVisible(true), 500)
    let currentStepIndex = 0

    const executeStep = () => {
      if (currentStepIndex >= steps.length) {
        setCurrentText("ايا ريقل انا كملت")
        setCurrentMood("happy")
        setTimeout(() => setIsVisible(false), 2000)
        return
      }

      const step = steps[currentStepIndex]
      const element = document.getElementById(step.targetId)

      if (element) {
        const rect = element.getBoundingClientRect()
        const targetX = rect.left + rect.width / 2
        const targetY = rect.top + rect.height / 2

        cursorX.set(targetX)
        cursorY.set(targetY)

        setCurrentMood(step.mood || "neutral")
        setCurrentText(step.text)

        currentStepIndex++
        setTimeout(executeStep, delayPerTarget)
      } else {
        currentStepIndex++
        executeStep()
      }
    }

    const startTourTimeout = setTimeout(executeStep, 1000)

    return () => {
      clearTimeout(showTimeout)
      clearTimeout(startTourTimeout)
    }
  }, [steps, delayPerTarget, cursorX, cursorY])

  const getMoodAnimation = () => {
    switch (currentMood) {
      case "funny":
        return {
          rotate: [0, 360, 720], 
          scale: [1, 1.2, 1],
          transition: { duration: 0.8, ease: "easeInOut" }
        }
      case "angry":
        return {
          x: [0, -6, 6, -6, 6, 0], 
          transition: { duration: 0.4, repeat: 2 }
        }
      case "excited":
        return {
          y: [0, -15, 0, -15, 0],
          transition: { duration: 0.5 }
        }
      case "happy":
        return {
          scale: [1, 1.3, 1], 
          transition: { duration: 0.4 }
        }
      default:
        return { rotate: 0, scale: 1 }
    }
  }

  return (
  <div className="fixed top-0 left-0 pointer-events-none z-[99999]">
      <motion.div
        className="absolute flex flex-col items-center"
        style={{ left: cursorX, top: cursorY }} 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {currentText && isVisible && (
            <motion.div
              key={currentText}
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: -10, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.8 }}
              className="absolute backdrop-blur-lg p-4 bottom-full mb-2  text-white px-4 py-2 rounded-xl text-lg  font-bold whitespace-nowrap  rtl"
              style={{ borderColor: getMoodColor(currentMood) }}
            >
              <div className="w-1/2 md:w-full">
                  {currentText}
              </div>
              <div
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 backdrop-blur-xl border-r-2 border-b-2"
                style={{ borderRightColor: getMoodColor(currentMood), borderBottomColor: getMoodColor(currentMood) }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div animate={getMoodAnimation() as any}>
          <CharacterCursorSVG mood={currentMood} />
        </motion.div>
      </motion.div>
    </div>
  )
}