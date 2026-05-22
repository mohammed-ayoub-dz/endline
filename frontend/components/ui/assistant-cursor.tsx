"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "motion/react";

interface AssistantCursorProps {
  targetSelector: string;
  delay?: number;
  moveDuration?: number;
  cursor?: React.ReactNode;
  springConfig?: {
    damping: number;
    stiffness: number;
    mass: number;
  };
}

const DefaultAssistantCursor = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}
  >
    <path
      d="M5.5 3.5L19 12L12 13L10 19L5.5 3.5Z"
      fill="url(#grad)"
      stroke="#fff"
      strokeWidth="1.5"
    />
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
    </defs>
  </svg>
);

export function AssistantCursor({
  targetSelector,
  delay = 800,
  moveDuration = 1200,
  cursor = <DefaultAssistantCursor />,
  springConfig = { damping: 25, stiffness: 200, mass: 0.8 },
}: AssistantCursorProps) {
  const [isActive, setIsActive] = useState(false);
  const targetPosition = useRef({ x: 0, y: 0 });
  const startPosition = useRef({ x: 0, y: 0 });
  const animationFrame = useRef<number | null>(null);


  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useMotionValue(0);


  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {

    const targetElement = document.querySelector(targetSelector) as HTMLElement;
    if (!targetElement) {
      console.warn(`AssistantCursor: target "${targetSelector}" not found`);
      return;
    }


    const rect = targetElement.getBoundingClientRect();
    targetPosition.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };


    startPosition.current = { x: -50, y: -50 };

    x.set(startPosition.current.x);
    y.set(startPosition.current.y);


    const timer = setTimeout(() => {
      setIsActive(true);
      opacity.set(1);


      x.set(targetPosition.current.x); 
      y.set(targetPosition.current.y);
    }, delay);


    return () => {
      clearTimeout(timer);
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [targetSelector, delay, moveDuration, x, y, opacity]);

  if (!isActive) return null;

  return (
    <motion.div
      style={{
        position: "fixed",
        left: springX,
        top: springY,
        translateX: "-50%",
        translateY: "-50%",
        opacity: opacity,
        zIndex: 9999,
        pointerEvents: "none",
        willChange: "transform",
      }}
      initial={{ scale: 0.8 }}
      animate={{ scale: [0.8, 1.2, 1] }}
      transition={{ duration: 0.5, delay: delay + moveDuration + 0.2 }}
    >
      {cursor}
    </motion.div>
  );
}
