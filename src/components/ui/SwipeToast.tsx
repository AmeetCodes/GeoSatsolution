"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export interface SwipeToastProps {
  open?: boolean;
  onClose?: (reason?: string) => void;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  background?: string;
  color?: string;
  fuseColor?: string;
  width?: number | string;
  radius?: number;
  slideMs?: number;
  settleBounce?: number;
  swipeDistance?: number;
  duration?: number;
  fuse?: "bottom" | "top" | "none";
  pauseOnHover?: boolean;
  closeButton?: boolean;
  inline?: boolean;
  className?: string;
}

export function SwipeToast({
  open = true,
  onClose,
  title,
  description,
  actionLabel,
  onAction,
  background = "#18181b",
  color = "#f4f4f5",
  fuseColor = "#06b6d4",
  width = 360,
  radius = 14,
  slideMs = 350,
  settleBounce = 0.15,
  swipeDistance = 45,
  duration = 4000,
  fuse = "bottom",
  pauseOnHover = true,
  closeButton = true,
  inline = false,
  className = "",
}: SwipeToastProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(100);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const remainingTimeRef = useRef<number>(duration);

  useEffect(() => {
    if (!open || duration <= 0) return;

    if (isHovered && pauseOnHover) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const interval = 50;
    const step = (interval / duration) * 100;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          onClose?.("timeout");
          return 0;
        }
        return Math.max(0, prev - step);
      });
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [open, isHovered, pauseOnHover, duration, onClose]);

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 15 }}
      transition={{
        duration: slideMs / 1000,
        bounce: settleBounce,
        type: "spring",
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > swipeDistance) {
          onClose?.("swiped");
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: background,
        color,
        borderRadius: radius,
        width: typeof width === "number" ? `${width}px` : width,
      }}
      className={`relative overflow-hidden shadow-2xl border border-white/10 p-4 select-none touch-none ${
        inline ? "inline-flex flex-col" : "fixed bottom-6 right-6 z-50 flex flex-col"
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 pr-2">
          <h4 className="text-sm font-semibold tracking-tight">{title}</h4>
          {description && (
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {actionLabel && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAction?.();
              }}
              className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              {actionLabel}
            </button>
          )}

          {closeButton && (
            <button
              type="button"
              onClick={() => onClose?.("manual")}
              className="p-1 text-zinc-400 hover:text-white rounded-md transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {fuse !== "none" && duration > 0 && (
        <div
          className={`absolute left-0 right-0 h-1 bg-white/5 ${
            fuse === "top" ? "top-0" : "bottom-0"
          }`}
        >
          <div
            className="h-full transition-all duration-75"
            style={{
              width: `${progress}%`,
              backgroundColor: fuseColor,
            }}
          />
        </div>
      )}
    </motion.div>
  );
}

export default SwipeToast;
