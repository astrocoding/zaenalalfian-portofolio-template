"use client";

import * as React from "react";
import { motion } from "framer-motion";

const SeigaihaFan: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => {
  const radii = [40, 33, 26, 19, 12, 5];
  return (
    <g>
      {/* Solid Paper Fill Base to Mask Out Lower/Behind Layers */}
      <path
        d={`M ${cx - 40} ${cy} A 40 40 0 0 1 ${cx + 40} ${cy} Z`}
        fill="#fef0de"
      />
      {/* Concentric Arc Rings (1:1 Perfect Circular Semicircles) */}
      {radii.map((r) => (
        <path
          key={r}
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          stroke="currentColor"
          strokeWidth="1.4"
          fill="none"
        />
      ))}
    </g>
  );
};

export interface SeigaihaPatternProps {
  className?: string;
  height?: number;
}

export const SeigaihaPattern: React.FC<SeigaihaPatternProps> = ({
  className = "",
  height = 80,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ height }}
      className={`absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-20 ${className}`}
    >
      <svg
        className="w-full h-full text-primary/45"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <pattern
          id="seigaiha-hero-pattern"
          x="0"
          y="0"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          {/* --- TIER 1: TOP STACK (y = 40, Top Peak touches y = 0 perfectly) --- */}
          <SeigaihaFan cx={0} cy={40} />
          <SeigaihaFan cx={80} cy={40} />
          <SeigaihaFan cx={-80} cy={40} />
          <SeigaihaFan cx={160} cy={40} />

          {/* --- TIER 2: MIDDLE STACK (y = 60) --- */}
          <SeigaihaFan cx={40} cy={60} />
          <SeigaihaFan cx={-40} cy={60} />
          <SeigaihaFan cx={120} cy={60} />

          {/* --- TIER 3: BOTTOM STACK (y = 80, Baseline touches y = 80 perfectly) --- */}
          <SeigaihaFan cx={0} cy={80} />
          <SeigaihaFan cx={80} cy={80} />
          <SeigaihaFan cx={-80} cy={80} />
          <SeigaihaFan cx={160} cy={80} />
        </pattern>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#seigaiha-hero-pattern)" />
      </svg>
    </motion.div>
  );
};
