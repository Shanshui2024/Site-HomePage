'use client';

import React, { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * FadeIn animation component using framer-motion
 * 
 * Features:
 * - Supports custom delay and duration
 * - Animation duration capped at 300ms (default: 300ms)
 * - Respects prefers-reduced-motion system preference
 * 
 * @param children - Content to animate
 * @param delay - Animation delay in seconds (default: 0)
 * @param duration - Animation duration in seconds, max 0.3 (default: 0.3)
 * @param className - Additional CSS classes
 */
export default function FadeIn({
  children,
  delay = 0,
  duration = 0.3,
  className = '',
}: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();
  
  // Cap duration at 300ms (0.3 seconds) as per requirement 9.4
  const cappedDuration = Math.min(duration, 0.3);

  // If user prefers reduced motion, disable animation (requirement 9.5)
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
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
