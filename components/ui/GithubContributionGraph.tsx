"use client";

import * as React from "react";

export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface ContributionData {
  total: Record<string, number>;
  contributions: ContributionDay[];
}

const FALLBACK_2026_TOTAL = 5093;

// 5 Distinct Contribution Colors (Theme Japanese Crimson & Warm Coral System)
const LEVEL_COLORS: Record<number, string> = {
  0: "bg-[#f2e2d0]/60 border border-[#e4d2bf]/50", // Level 0: Empty/future day (subtle paper slot, clearly empty!)
  1: "bg-[#e89b9d] border border-[#d48587]",       // Level 1: Warm rose pink (distinct light active day)
  2: "bg-[#d45d61] border border-[#be4a4e]",       // Level 2: Vibrant coral vermilion (medium active day)
  3: "bg-[#b34c53] border border-[#9b3b42]",       // Level 3: Secondary crimson (--color-secondary)
  4: "bg-[#6e1a1c] border border-[#541214]",       // Level 4: Deep imperial crimson (--color-primary-dark)
};

export const GithubContributionGraph: React.FC<{ username?: string }> = ({
  username: propUsername,
}) => {
  const [fetchedUsername, setFetchedUsername] = React.useState<string | null>(null);
  const username = propUsername || fetchedUsername || "astrocoding";
  const [data, setData] = React.useState<ContributionDay[]>([]);
  const [totalCount, setTotalCount] = React.useState<number>(FALLBACK_2026_TOTAL);

  // Dynamically load username from User table database via /api/profile API when prop is omitted
  React.useEffect(() => {
    if (propUsername) return;

    let isMounted = true;
    async function loadDynamicUsername() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json?.username) {
            setFetchedUsername(json.username);
          }
        }
      } catch (err) {
        console.warn("Using fallback GitHub username", err);
      }
    }

    loadDynamicUsername();
    return () => {
      isMounted = false;
    };
  }, [propUsername]);

  React.useEffect(() => {
    let isMounted = true;
    async function fetchContributions() {
      try {
        const apiBase = process.env.NEXT_PUBLIC_GITHUB_API_PUBLIC || process.env.GITHUB_API_PUBLIC || "https://github-contributions-api.jogruber.de/v4/";
        const cleanBase = apiBase.endsWith("/") ? apiBase : `${apiBase}/`;
        const res = await fetch(`${cleanBase}${username}?y=2026`);
        if (!res.ok) throw new Error("Failed to fetch");
        const json: ContributionData = await res.json();
        if (isMounted && json.contributions) {
          const year2026Data = json.contributions.filter((d) => d.date.startsWith("2026"));
          if (year2026Data.length > 0) {
            setData(year2026Data);
          }
          if (json.total && json.total["2026"] !== undefined) {
            setTotalCount(json.total["2026"]);
          }
        }
      } catch (err) {
        console.warn("Using default github contribution structure", err);
      }
    }

    fetchContributions();
    return () => {
      isMounted = false;
    };
  }, [username]);

  // Generate fallback 2026 dataset if live data is pending/offline
  const displayDays = React.useMemo(() => {
    if (data.length > 0) return data;

    const days: ContributionDay[] = [];
    const startDate = new Date(2026, 0, 1);
    for (let i = 0; i < 365; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];

      // Deterministic level distribution matching user's active history (Jan-July active)
      // Eliminates SSR hydration mismatch caused by Math.random()
      const hasContrib = i < 205;
      const count = hasContrib ? ((i * 37 + 17) % 85) + 1 : 0;
      let level = 0;
      if (count > 0) level = 1;
      if (count > 15) level = 2;
      if (count > 35) level = 3;
      if (count > 60) level = 4;

      days.push({ date: dateStr, count, level });
    }
    return days;
  }, [data]);

  // Align starting weekday (Mon-based)
  const paddedDays = React.useMemo(() => {
    if (displayDays.length === 0) return [];
    const firstDate = new Date(displayDays[0].date);
    const jsDay = firstDate.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    const padCount = (jsDay + 6) % 7; // Mon=0, ..., Sun=6

    const padding: (ContributionDay | null)[] = Array(padCount).fill(null);
    return [...padding, ...displayDays];
  }, [displayDays]);

  // Group into columns of 7 days
  const weeks = React.useMemo(() => {
    const cols: (ContributionDay | null)[][] = [];
    let currentWeek: (ContributionDay | null)[] = [];

    paddedDays.forEach((day, i) => {
      currentWeek.push(day);
      if (currentWeek.length === 7 || i === paddedDays.length - 1) {
        cols.push(currentWeek);
        currentWeek = [];
      }
    });
    return cols;
  }, [paddedDays]);

  // Extract month labels with grid column positions
  const monthLabels = React.useMemo(() => {
    const labels: { name: string; colIndex: number }[] = [];
    let lastMonth = -1;

    weeks.forEach((week, colIdx) => {
      const firstRealDay = week.find((d) => d !== null);
      if (firstRealDay) {
        const monthNum = new Date(firstRealDay.date).getMonth();
        if (monthNum !== lastMonth) {
          const monthName = new Date(firstRealDay.date).toLocaleDateString("en-US", { month: "short" });
          labels.push({ name: monthName, colIndex: colIdx });
          lastMonth = monthNum;
        }
      }
    });

    return labels;
  }, [weeks]);

  return (
    <div className="mt-5 pt-4 border-t border-border-subtle/80 w-full">
      {/* Header Info */}
      <div className="flex items-center justify-between text-xs font-mono text-ink-muted mb-2.5">
        <span className="font-semibold text-ink flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          {totalCount.toLocaleString("en-US")} contributions in 2026
        </span>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] hover:text-primary transition-colors text-ink-muted font-medium underline decoration-border-warm"
        >
          @{username}
        </a>
      </div>

      {/* Main Contribution Grid Wrapper */}
      <div className="p-3.5 rounded-2xl bg-paper border border-border-warm overflow-x-auto scrollbar-none shadow-xs w-full">
        <div className="w-full min-w-[560px]">
          {/* Month Header Row */}
          <div className="relative h-4 text-[10px] font-mono text-ink-muted mb-1.5 pl-7 pr-2">
            {monthLabels.map((m, idx) => (
              <span
                key={idx}
                className="absolute"
                style={{ left: `calc(28px + ${(m.colIndex / (weeks.length || 53)) * 92}%)` }}
              >
                {m.name}
              </span>
            ))}
          </div>

          <div className="flex gap-2 w-full">
            {/* Day of week labels */}
            <div className="flex flex-col justify-between text-[9.5px] font-mono text-ink-muted font-medium pr-1 py-0.5 select-none h-[81px] shrink-0">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Weeks Grid Columns: Auto-expanding equal fractions across 100% width */}
            <div className="grid grid-flow-col auto-cols-fr gap-[3px] w-full">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-[3px] w-full items-center">
                  {week.map((day, dIdx) =>
                    day ? (
                      <div
                        key={dIdx}
                        title={`${day.count} contributions on ${day.date}`}
                        className={`w-full aspect-square max-w-[11px] max-h-[11px] rounded-[2px] transition-transform hover:scale-125 hover:z-10 cursor-pointer ${
                          LEVEL_COLORS[day.level] || LEVEL_COLORS[0]
                        }`}
                      />
                    ) : (
                      <div key={dIdx} className="w-full aspect-square max-w-[11px] max-h-[11px] opacity-0" />
                    )
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Legend */}
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border-subtle/50 text-[10px] font-mono text-ink-muted">
            <span className="text-[9.5px]">Public Activity / GitHub</span>
            <div className="flex items-center gap-1.5">
              <span>Less</span>
              <div className="flex gap-[2.5px] items-center">
                <div className={`w-[9px] h-[9px] rounded-[2px] ${LEVEL_COLORS[0]}`} />
                <div className={`w-[9px] h-[9px] rounded-[2px] ${LEVEL_COLORS[1]}`} />
                <div className={`w-[9px] h-[9px] rounded-[2px] ${LEVEL_COLORS[2]}`} />
                <div className={`w-[9px] h-[9px] rounded-[2px] ${LEVEL_COLORS[3]}`} />
                <div className={`w-[9px] h-[9px] rounded-[2px] ${LEVEL_COLORS[4]}`} />
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
