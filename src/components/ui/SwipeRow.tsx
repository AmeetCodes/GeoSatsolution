"use client";

import React, { useState } from "react";
import { motion, useMotionValue, PanInfo } from "framer-motion";

export interface SwipeAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  drawer?: string;
  disabled?: boolean;
  dismiss?: boolean;
  color?: string;
}

export interface SwipeRowProps {
  children: React.ReactNode;
  actions: SwipeAction[];
  onAction?: (action: { id: string }) => void;
  onCommit?: (action: { id: string }) => void;
  actionColor?: string;
  drawerColor?: string;
  rowColor?: string;
  textColor?: string;
  height?: number;
  radius?: number;
  actionWidth?: number;
  direction?: "left" | "right" | "both";
  snapBounce?: number;
  resistance?: number;
  collapseMs?: number;
  commitAt?: number;
  fullSwipe?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function SwipeRow({
  children,
  actions = [],
  onAction,
  onCommit,
  actionColor = "#e5484d",
  drawerColor = "#f1f5f9",
  rowColor = "#ffffff",
  textColor = "#0f172a",
  height = 64,
  radius = 14,
  actionWidth = 80,
  direction = "left",
  resistance = 0.55,
  fullSwipe = true,
  style = {},
  className = "",
}: SwipeRowProps) {
  const [collapsed, setCollapsed] = useState(false);
  const totalActionsWidth = actions.length * actionWidth;
  const x = useMotionValue(0);

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (direction === "left" && (offset < -120 || velocity < -300)) {
      if (fullSwipe && actions.length > 0) {
        const primaryAction = actions[0];
        onCommit?.({ id: primaryAction.id });
        setCollapsed(true);
        return;
      }
    }

    if (offset < -totalActionsWidth / 2) {
      x.set(-totalActionsWidth);
    } else {
      x.set(0);
    }
  };

  if (collapsed) return null;

  return (
    <div
      style={{
        height: `${height}px`,
        borderRadius: `${radius}px`,
        position: "relative",
        overflow: "hidden",
        backgroundColor: drawerColor,
        ...style,
      }}
      className={`relative select-none ${className}`}
    >
      {/* Background Actions Drawer */}
      <div
        className="absolute inset-y-0 right-0 flex items-center justify-end z-0"
        style={{ width: `${totalActionsWidth}px` }}
      >
        {actions.map((action, idx) => (
          <button
            key={action.id}
            type="button"
            disabled={action.disabled}
            onClick={() => {
              onAction?.({ id: action.id });
              if (action.dismiss) {
                onCommit?.({ id: action.id });
                setCollapsed(true);
              }
            }}
            style={{
              width: `${actionWidth}px`,
              backgroundColor: action.color || (idx === 0 ? actionColor : drawerColor),
              color: "#ffffff",
            }}
            className="h-full flex flex-col items-center justify-center gap-1 font-medium text-xs transition-opacity hover:opacity-90 active:scale-95 disabled:opacity-40"
          >
            {action.icon}
            <span>{action.label}</span>
          </button>
        ))}
      </div>

      {/* Foreground Swipeable Content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -totalActionsWidth, right: 0 }}
        dragElastic={resistance}
        style={{
          x,
          height: "100%",
          backgroundColor: rowColor,
          color: textColor,
          borderRadius: `${radius}px`,
        }}
        onDragEnd={handleDragEnd}
        className="relative z-10 w-full flex items-center px-5 cursor-grab active:cursor-grabbing border border-black/5"
      >
        {children}
      </motion.div>
    </div>
  );
}

export default SwipeRow;
