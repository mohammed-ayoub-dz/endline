"use client";

import { useEffect, useState } from "react";
import { PomodoroTimer } from "@/components/pomodoro/pomodoro-timer";
import { SoundPlayer } from "@/components/pomodoro/sound-player";
import { Notes } from "@/components/pomodoro/notes";
import { getSettings, saveSettings } from "@/lib/pomodoroDB";

export default function PomodoroPage() {
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  useEffect(() => {
    getSettings().then((settings) => {
      if (settings) {
        setWorkDuration(settings.workDuration);
        setBreakDuration(settings.breakDuration);
      }
    });
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleWorkChange = (mins: number) => {
    setWorkDuration(mins);
    saveSettings(mins, breakDuration);
  };
  const handleBreakChange = (mins: number) => {
    setBreakDuration(mins);
    saveSettings(workDuration, mins);
  };

  const showMessage = (msg: { type: string; text: string }) => {
    setMessage(msg);
  };

  return (
    <div className=" text-white p-6">
      {message && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div
            className={`px-4 py-2 rounded-xl shadow-lg bg-white text-black`}
          >
            {message.text}
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">التركيز</h1>
        <div className="mb-12">
          <PomodoroTimer
            workDuration={workDuration}
            breakDuration={breakDuration}
            onWorkDurationChange={handleWorkChange}
            onBreakDurationChange={handleBreakChange}
            onPhaseChange={(phase) => {
              showMessage({
                type: "info",
                text: phase === "break" ? "وقت الراحة! استرخِ قليلاً" : "انتهت الراحة، عد إلى العمل",
              });
            }}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <SoundPlayer onMessage={showMessage} />
          <Notes onMessage={showMessage} />
        </div>
      </div>
    </div>
  );
}