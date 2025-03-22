"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
  iconClassName?: string;
  hoverEffect?: boolean;
  delay?: number;
  gradient?: string;
  children?: React.ReactNode;
}

export function FeatureCard({
  title,
  description,
  icon,
  className,
  iconClassName,
  hoverEffect = true,
  delay = 0,
  gradient = "from-indigo-500 via-purple-500 to-pink-500",
  children
}: FeatureCardProps) {
  const [mouseEnter, setMouseEnter] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Track mouse position for gradient effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative rounded-2xl p-px overflow-hidden",
        "bg-gray-800 hover:shadow-xl transition-all duration-500",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      onMouseEnter={() => setMouseEnter(true)}
      onMouseLeave={() => setMouseEnter(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Animated border gradient */}
      <AnimatePresence>
        {mouseEnter && hoverEffect && (
          <motion.div
            className={cn(
              "absolute inset-0 opacity-70",
              `bg-gradient-to-r ${gradient}`
            )}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 0.7,
              background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, ${getGradientColors(gradient)})` 
            }}
            exit={{ opacity: 0 }}
            style={{
              borderRadius: "inherit",
            }}
          />
        )}
      </AnimatePresence>

      <div className="relative p-6 bg-gray-900 rounded-2xl h-full z-10">
        {icon && (
          <div className={cn("mb-4", iconClassName)}>
            {icon}
          </div>
        )}
        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-white">
          {title}
        </h3>
        <p className="text-gray-400 group-hover:text-gray-300">
          {description}
        </p>
        {children}
      </div>
    </motion.div>
  );
}

// Helper function to extract colors from tailwind gradient class
function getGradientColors(gradientClass: string): string {
  const colors = {
    "from-indigo-500 via-purple-500 to-pink-500": "rgba(99, 102, 241, 0.8), rgba(168, 85, 247, 0.4), rgba(236, 72, 153, 0.2)",
    "from-blue-500 via-teal-500 to-emerald-500": "rgba(59, 130, 246, 0.8), rgba(20, 184, 166, 0.4), rgba(16, 185, 129, 0.2)",
    "from-orange-500 via-amber-500 to-yellow-500": "rgba(249, 115, 22, 0.8), rgba(245, 158, 11, 0.4), rgba(234, 179, 8, 0.2)",
  };
  
  return colors[gradientClass as keyof typeof colors] || colors["from-indigo-500 via-purple-500 to-pink-500"];
} 