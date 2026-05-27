"use client";

import * as React from "react";

/* --- Seigaiha Wave Accent Fan --- */
const CornerSeigaihaFan: React.FC<{ cx: number; cy: number; fillColor?: string }> = ({
  cx,
  cy,
  fillColor = "#fef0de",
}) => {
  const radii = [44, 35, 26, 17, 8];
  return (
    <g>
      {/* Solid Base matching card background */}
      <path
        d={`M ${cx - 44} ${cy} A 44 44 0 0 1 ${cx + 44} ${cy} Z`}
        fill={fillColor}
      />
      {/* Concentric Arc Rings using --color-primary (#b04749) */}
      {radii.map((r) => (
        <path
          key={r}
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          stroke="#b04749"
          strokeWidth="1.35"
          strokeOpacity="0.36"
          fill="none"
        />
      ))}
    </g>
  );
};

export interface CardCornerSeigaihaProps {
  cardBgColor?: string;
  className?: string;
}

export const CardCornerSeigaiha: React.FC<CardCornerSeigaihaProps> = ({
  cardBgColor = "#fef0de",
  className = "",
}) => {
  return (
    <div
      className={`absolute bottom-0 right-0 w-[170px] sm:w-[190px] h-[135px] sm:h-[150px] pointer-events-none z-0 overflow-hidden select-none ${className}`}
    >
      <svg
        viewBox="-40 -40 280 220"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="rotate(-28 220 150)">
          {/* Tier 1 (Innermost single crown peak - 1 fan) */}
          <CornerSeigaihaFan cx={140} cy={30} fillColor={cardBgColor} />

          {/* Tier 2 (2 fans) */}
          <CornerSeigaihaFan cx={105} cy={56} fillColor={cardBgColor} />
          <CornerSeigaihaFan cx={175} cy={56} fillColor={cardBgColor} />

          {/* Tier 3 (3 fans) */}
          <CornerSeigaihaFan cx={70} cy={82} fillColor={cardBgColor} />
          <CornerSeigaihaFan cx={140} cy={82} fillColor={cardBgColor} />
          <CornerSeigaihaFan cx={210} cy={82} fillColor={cardBgColor} />

          {/* Tier 4 (4 fans) */}
          <CornerSeigaihaFan cx={35} cy={108} fillColor={cardBgColor} />
          <CornerSeigaihaFan cx={105} cy={108} fillColor={cardBgColor} />
          <CornerSeigaihaFan cx={175} cy={108} fillColor={cardBgColor} />
          <CornerSeigaihaFan cx={245} cy={108} fillColor={cardBgColor} />

          {/* Tier 5 (Corner baseline fill - 4 fans) */}
          <CornerSeigaihaFan cx={70} cy={134} fillColor={cardBgColor} />
          <CornerSeigaihaFan cx={140} cy={134} fillColor={cardBgColor} />
          <CornerSeigaihaFan cx={210} cy={134} fillColor={cardBgColor} />
          <CornerSeigaihaFan cx={280} cy={134} fillColor={cardBgColor} />

          {/* Tier 6 (Bottom-right corner tip fill - 3 fans) */}
          <CornerSeigaihaFan cx={105} cy={160} fillColor={cardBgColor} />
          <CornerSeigaihaFan cx={175} cy={160} fillColor={cardBgColor} />
          <CornerSeigaihaFan cx={245} cy={160} fillColor={cardBgColor} />
          <CornerSeigaihaFan cx={315} cy={160} fillColor={cardBgColor} />

          {/* Tier 7 (cy = 186: Fills bottom-right corner tip completely) */}
          <CornerSeigaihaFan cx={140} cy={186} fillColor={cardBgColor} />
          <CornerSeigaihaFan cx={210} cy={186} fillColor={cardBgColor} />
          <CornerSeigaihaFan cx={280} cy={186} fillColor={cardBgColor} />
          <CornerSeigaihaFan cx={350} cy={186} fillColor={cardBgColor} />

          {/* Tier 8 (cy = 212: Deep corner fill) */}
          <CornerSeigaihaFan cx={175} cy={212} fillColor={cardBgColor} />
          <CornerSeigaihaFan cx={245} cy={212} fillColor={cardBgColor} />
          <CornerSeigaihaFan cx={315} cy={212} fillColor={cardBgColor} />
        </g>
      </svg>
    </div>
  );
};
