"use client";

import * as React from "react";

export interface GenkoYoshiPatternProps {
  className?: string;
}

export const GenkoYoshiPattern: React.FC<GenkoYoshiPatternProps> = ({
  className = "",
}) => {
  const patternId = React.useId().replace(/:/g, "_");
  const innerPatternId = `${patternId}-inner`;
  const maskXId = `${patternId}-mask-x`;
  const maskYId = `${patternId}-mask-y`;
  const maskId = `${patternId}-mask`;

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden rounded-2xl select-none opacity-50 ${className}`}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full text-primary/65"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main Grid Outer Box Pattern */}
          <pattern
            id={patternId}
            width="44"
            height="44"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 0 0 H 44 V 44 H 0 Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 2.5"
              fill="none"
              opacity="0.8"
            />
          </pattern>

          {/* Inner Crosshair Dashed Lines Pattern */}
          <pattern
            id={innerPatternId}
            width="44"
            height="44"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="22"
              y1="0"
              x2="22"
              y2="44"
              stroke="currentColor"
              strokeWidth="0.8"
              strokeDasharray="2.5 2.5"
              opacity="0.6"
            />
            <line
              x1="0"
              y1="22"
              x2="44"
              y2="22"
              stroke="currentColor"
              strokeWidth="0.8"
              strokeDasharray="2.5 2.5"
              opacity="0.6"
            />
          </pattern>

          {/* Mask to mask out inner dashed lines on incomplete right/bottom edge cells */}
          <linearGradient id={maskXId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="85%" stopColor="#fff" stopOpacity="1" />
            <stop offset="95%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={maskYId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="78%" stopColor="#fff" stopOpacity="1" />
            <stop offset="92%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>

          <mask id={maskId}>
            <rect width="100%" height="100%" fill={`url(#${maskXId})`} />
            <rect
              width="100%"
              height="100%"
              fill={`url(#${maskYId})`}
              style={{ mixBlendMode: "multiply" }}
            />
          </mask>
        </defs>

        {/* 1. Outer Box Lines */}
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />

        {/* 2. Inner Dashed Lines (Masked at right & bottom edges so only outer lines show on incomplete cells) */}
        <rect
          width="100%"
          height="100%"
          fill={`url(#${innerPatternId})`}
          mask={`url(#${maskId})`}
        />
      </svg>
    </div>
  );
};
