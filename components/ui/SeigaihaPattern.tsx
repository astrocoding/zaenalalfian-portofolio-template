"use client";

import * as React from "react";

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
  height?: number | string;
}

export const SeigaihaPattern: React.FC<SeigaihaPatternProps> = ({
  className = "",
  height,
}) => {
  return (
    <div
      style={height ? { height } : undefined}
      className={`absolute bottom-0 left-0 right-0 w-full h-[100px] sm:h-[120px] lg:h-20 overflow-hidden leading-none pointer-events-none z-0 seigaiha-fade-in ${className}`}
    >
      <svg
        className="w-full h-full text-primary/45"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="geometricPrecision"
        preserveAspectRatio="xMidYMin slice"
      >
        <pattern
          id="seigaiha-hero-pattern"
          x="0"
          y="0"
          width="80"
          height="220"
          patternUnits="userSpaceOnUse"
        >
          {/* --- TIER 1: Topmost wave crests (cy = 40 -> peaks at y = 0) --- */}
          <SeigaihaFan cx={0} cy={40} />
          <SeigaihaFan cx={80} cy={40} />
          <SeigaihaFan cx={-80} cy={40} />
          <SeigaihaFan cx={160} cy={40} />

          {/* --- TIER 2: Staggered wave crests (cy = 60 -> peaks at y = 20) --- */}
          <SeigaihaFan cx={40} cy={60} />
          <SeigaihaFan cx={-40} cy={60} />
          <SeigaihaFan cx={120} cy={60} />

          {/* --- TIER 3: cy = 80 -> peaks at y = 40 --- */}
          <SeigaihaFan cx={0} cy={80} />
          <SeigaihaFan cx={80} cy={80} />
          <SeigaihaFan cx={-80} cy={80} />
          <SeigaihaFan cx={160} cy={80} />

          {/* --- TIER 4: cy = 100 -> peaks at y = 60 --- */}
          <SeigaihaFan cx={40} cy={100} />
          <SeigaihaFan cx={-40} cy={100} />
          <SeigaihaFan cx={120} cy={100} />

          {/* --- TIER 5: cy = 120 -> peaks at y = 80 --- */}
          <SeigaihaFan cx={0} cy={120} />
          <SeigaihaFan cx={80} cy={120} />
          <SeigaihaFan cx={-80} cy={120} />
          <SeigaihaFan cx={160} cy={120} />

          {/* --- TIER 6: cy = 140 -> peaks at y = 100 --- */}
          <SeigaihaFan cx={40} cy={140} />
          <SeigaihaFan cx={-40} cy={140} />
          <SeigaihaFan cx={120} cy={140} />

          {/* --- TIER 7: cy = 160 -> peaks at y = 120 --- */}
          <SeigaihaFan cx={0} cy={160} />
          <SeigaihaFan cx={80} cy={160} />
          <SeigaihaFan cx={-80} cy={160} />
          <SeigaihaFan cx={160} cy={160} />

          {/* --- TIER 8: cy = 180 --- */}
          <SeigaihaFan cx={40} cy={180} />
          <SeigaihaFan cx={-40} cy={180} />
          <SeigaihaFan cx={120} cy={180} />

          {/* --- TIER 9: cy = 200 --- */}
          <SeigaihaFan cx={0} cy={200} />
          <SeigaihaFan cx={80} cy={200} />
          <SeigaihaFan cx={-80} cy={200} />
          <SeigaihaFan cx={160} cy={200} />
        </pattern>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#seigaiha-hero-pattern)"
        />
      </svg>
    </div>
  );
};
