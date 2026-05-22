// components/pomodoro/pomodoro-timer.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HugeiconsIcon } from "@hugeicons/react";
import { Play, Pause, RotateCcw, Brain, Coffee, X, Idea01Icon } from "@hugeicons/core-free-icons";

interface PomodoroTimerProps {
  workDuration: number;
  breakDuration: number;
  onWorkDurationChange: (mins: number) => void;
  onBreakDurationChange: (mins: number) => void;
  onPhaseChange?: (phase: "work" | "break") => void;
}

export function PomodoroTimer({
  workDuration,
  breakDuration,
  onWorkDurationChange,
  onBreakDurationChange,
  onPhaseChange,
}: PomodoroTimerProps) {
  const [phase, setPhase] = useState<"work" | "break">("work");
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {
    if (!isActive && phase === "work") {
      setTimeLeft(workDuration * 60);
    }
  }, [workDuration, phase, isActive]);


  useEffect(() => {
    if (!isActive && phase === "break") {
      setTimeLeft(breakDuration * 60);
    }
  }, [breakDuration, phase, isActive]);


  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {

        setIsActive(false);
      setIsFocusMode(false);
      const newPhase = phase === "work" ? "break" : "work";
      setPhase(newPhase);
      const newDuration = newPhase === "work" ? workDuration * 60 : breakDuration * 60;
      setTimeLeft(newDuration);
      onPhaseChange?.(newPhase);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft, phase, workDuration, breakDuration, onPhaseChange]);


  useEffect(() => {
    setIsFocusMode(isActive);
  }, [isActive]);

  const startTimer = () => setIsActive(true);
  const resetTimer = () => {
    setIsActive(false);
    setPhase("work");
    setTimeLeft(workDuration * 60);
  };
  const exitFocusMode = () => setIsActive(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };


  if (isFocusMode) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md">
        <div className="text-center">
          <div className="mb-4">
            {phase === "work" ? (
              <HugeiconsIcon icon={Idea01Icon} className="h-12 w-12  mx-auto" />
            ) : (
              <HugeiconsIcon icon={Coffee} className="h-12 w-12 text-green-400 mx-auto" />
            )}
            <p className="text-xl mt-2 text-white/70">
              {phase === "work" ? "وقت التركيز" : "وقت الراحة"}
            </p>
          </div>
          <div className="font-mono text-8xl md:text-9xl font-bold text-white tracking-tighter">
            {formatTime(timeLeft)}
          </div>
          <Button
            variant="ghost"
            size="lg"
            onClick={exitFocusMode}
            className="mt-12 text-white/70 hover:text-white hover:bg-white/10 gap-2"
          >
            <HugeiconsIcon icon={X} className="h-5 w-5" />
            إيقاف البومودورو
          </Button>
        </div>
      </div>
    );
  }


  return (
    <div className="backdrop-blur-md rounded-3xl p-8 border border-white/20">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          {phase === "work" ? (
            <HugeiconsIcon icon={Idea01Icon} className="h-6 w-6 " />
          ) : (
            <HugeiconsIcon icon={Coffee} className="h-6 w-6 " />
          )}
          <span className="text-xl font-semibold">{phase === "work" ? "وقت التركيز" : "وقت الراحة"}</span>
        </div>
        <span className="font-mono text-7xl font-bold">{formatTime(timeLeft)}</span>
      </div>
      <div className="flex justify-center gap-4">
        <Button onClick={startTimer} className="gap-2">
          <HugeiconsIcon icon={Play} />
          بدء
        </Button>
        <Button variant="outline" onClick={resetTimer} className="gap-2">
          <HugeiconsIcon icon={RotateCcw} />
          إعادة
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>
          <Label>مدة العمل (دقائق)</Label>
          <Input
            type="number"
            value={workDuration}
            onChange={(e) => onWorkDurationChange(Number(e.target.value))}
            min={1}
            max={120}
            disabled={isActive}
          />
        </div>
        <div>
          <Label>مدة الراحة (دقائق)</Label>
          <Input
            type="number"
            value={breakDuration}
            onChange={(e) => onWorkDurationChange(Number(e.target.value))}
            min={1}
            max={30}
            disabled={isActive}
          />
        </div>
      </div>
    </div>
  );
}