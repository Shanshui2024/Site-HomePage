'use client';

import React, { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export type SlideDirection = 'left' | 'right' | 'up' | 'down';

export interface SlideInProps {
  children: ReactNode;
  direction?: SlideDirection;
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * SlideIn animation component using framer-motion
 * 
 * Features:
 * - Supports four directions: left, right, up, down
 * - Supports custom delay and duration
 * - Animation duration capped at 300ms (default: 300ms)
 * - Respects prefers-reduced-motion system preference
 * 
 * @param children - Content to animate
 * @param direction - Direction of slide animation (default: 'left')
 * @param delay - Animation delay in seconds (default: 0)
 * @param duration - Animation duration in seconds, max 0.3 (default: 0.3)
 * @param className - Additional CSS classes
 */
export default function SlideIn({
  children,
  direction = 'left',
  delay = 0,
  duration = 0.3,
  className = '',
}: SlideInProps) {
  const shouldReduceMotion = useReducedMotion();
  
  // Cap duration at 300ms (0.3 seconds) as per requirement 9.4
  const cappedDuration = Math.min(duration, 0.3);

  // Define initial position based on direction
  const getInitialPosition = () => {
    const offset = 50; // pixels to slide from
    switch (direction) {
      case 'left':
        return { x: -offset, opacity: 0 };
      case 'right':
        return { x: offset, opacity: 0 };
      case 'up':
        return { y: -offset, opacity: 0 };
      case 'down':
        return { y: offset, opacity: 0 };
      default:
        return { x: -offset, opacity: 0 };
    }
  };

  // If user prefers reduced motion, disable animation (requirement 9.5)
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={getInitialPosition()}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{
        duration: cappedDuration,
        delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
