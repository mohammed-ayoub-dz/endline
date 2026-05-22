// components/ui/pomodoro-timer.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring, PanInfo } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Brain,
  Coffee,
  Play,
  Pause,
  RotateCcw,
} from "@hugeicons/core-free-icons";
import { savePomodoroState, getPomodoroState } from "@/lib/indexeddb";

type PomodoroSize = "small" | "medium" | "large";
type Phase = "work" | "break";

const sizeConfig = {
  small: { width: "w-56", textSize: "text-2xl", padding: "p-3" },
  medium: { width: "w-72", textSize: "text-3xl", padding: "p-4" },
  large: { width: "w-96", textSize: "text-4xl", padding: "p-5" },
};

export function PomodoroTimer({
  onPhaseChange,
  onTick,
}: {
  onPhaseChange?: (phase: Phase) => void;
  onTick?: (timeLeft: number) => void;
}) {
  const [phase, setPhase] = useState<Phase>("work");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [workDuration] = useState(25 * 60);
  const [breakDuration] = useState(5 * 60);
  const [size, setSize] = useState<PomodoroSize>("medium");
  const [position, setPosition] = useState({ x: 16, y: 16 });
  const x = useMotionValue(position.x);
  const y = useMotionValue(position.y);
  const springX = useSpring(x, { damping: 30, stiffness: 400 });
  const springY = useSpring(y, { damping: 30, stiffness: 400 });
  const velocityMotion = useMotionValue(0);
  const scaleX = useTransform(velocityMotion, [0, 1000], [1, 0.92]);
  const scaleY = useTransform(velocityMotion, [0, 1000], [1, 0.88]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    getPomodoroState().then((saved) => {
      if (saved) {
        setPhase(saved.phase);
        setTimeLeft(saved.timeLeft);
        setIsActive(saved.isActive);
        if (saved.size) setSize(saved.size);
        if (saved.position) {
          setPosition(saved.position);
          x.set(saved.position.x);
          y.set(saved.position.y);
        }
      }
    });
  }, [x, y]);


  useEffect(() => {
    savePomodoroState({
      phase,
      timeLeft,
      isActive,
      workDuration,
      breakDuration,
      position,
      size,
    });
  }, [phase, timeLeft, isActive, workDuration, breakDuration, position, size]);

  useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);


  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          onTick?.(newTime);
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (phase === "work") {
        setPhase("break");
        setTimeLeft(breakDuration);
      } else {
        setPhase("work");
        setTimeLeft(workDuration);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft, phase, workDuration, breakDuration, onTick]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setPhase("work");
    setTimeLeft(workDuration);
  };
  const changeSize = () => {
    const sizes: PomodoroSize[] = ["small", "medium", "large"];
    const next = sizes[(sizes.indexOf(size) + 1) % sizes.length];
    setSize(next);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };


  const handleDrag = (_: any, info: PanInfo) => {
    const newX = info.point.x - (timerRef.current?.offsetWidth || 0) / 2;
    const newY = info.point.y - (timerRef.current?.offsetHeight || 0) / 2;
    const clampedX = Math.max(8, Math.min(window.innerWidth - (timerRef.current?.offsetWidth || 200) - 8, newX));
    const clampedY = Math.max(8, Math.min(window.innerHeight - (timerRef.current?.offsetHeight || 200) - 8, newY));
    setPosition({ x: clampedX, y: clampedY });
    x.set(clampedX);
    y.set(clampedY);

    const speed = Math.hypot(info.velocity.x, info.velocity.y);
    velocityMotion.set(speed);
  };

  const handleDragEnd = () => {

    setTimeout(() => velocityMotion.set(0), 150);
  };

  const widthClass = sizeConfig[size].width;
  const textSize = sizeConfig[size].textSize;
  const padding = sizeConfig[size].padding;

  return (
    <motion.div
      ref={timerRef}
      className={`fixed z-50 rounded-2xl backdrop-blur-lg border border-white/20 shadow-2xl  ${widthClass}`}
      style={{
        top: springY,
        left: springX,
        scaleX: scaleX,
        scaleY: scaleY,
        cursor: "grab",
      }}
      drag
      dragMomentum
      dragElastic={0.1}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: "grabbing", scale: 0.98 }}
      transition={{ type: "spring", damping: 25, stiffness: 350 }}
    >
      <div className={`${padding} space-y-2`}>
        {/* Drag handle area */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {phase === "work" ? (
              <HugeiconsIcon icon={Brain} className="h-4 w-4 text-orange-400" />
            ) : (
              <HugeiconsIcon icon={Coffee} className="h-4 w-4 text-green-400" />
            )}
            <span className="text-xs font-medium text-white/80">
              {phase === "work" ? "تركيز" : "راحة"}
            </span>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-white hover:bg-white/20"
              onClick={toggleTimer}
            >
              {isActive ? (
                <HugeiconsIcon icon={Pause} className="h-3 w-3" />
              ) : (
                <HugeiconsIcon icon={Play} className="h-3 w-3" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-white hover:bg-white/20"
              onClick={resetTimer}
            >
              <HugeiconsIcon icon={RotateCcw} className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-white hover:bg-white/20"
              onClick={changeSize}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-3" />
                <path d="M16 3h5v5" />
                <path d="M21 3l-9 9" />
              </svg>
            </Button>
          </div>
        </div>
        <div className="text-center">
          <span className={`font-mono font-bold text-white ${textSize}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <motion.div
        className="absolute inset-0 rounded-2xl -z-10 pointer-events-none"
        style={{
          opacity: useTransform(velocityMotion, [0, 800], [0, 0.5]),
          scaleX: useTransform(velocityMotion, [0, 800], [1, 1.2]),
          scaleY: useTransform(velocityMotion, [0, 800], [1, 0.9]),
          filter: useTransform(velocityMotion, [0, 800], ["blur(0px)", "blur(6px)"]),
          backgroundColor: "rgba(255,255,255,0.15)",
          transformOrigin: "center",
        }}
      />
    </motion.div>
  );
}