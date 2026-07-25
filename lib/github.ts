export interface GitHubAllTimeStats {
  totalCommits: number;
  formattedDisplay: {
    val: number;
    decimals: number;
    suffix: string;
  };
}

let memoryCache: { data: GitHubAllTimeStats; timestamp: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

export async function fetchGitHubAllTimeCommits(
  username: string = "astrocoding"
): Promise<GitHubAllTimeStats> {
  const now = Date.now();
  if (memoryCache && now - memoryCache.timestamp < CACHE_TTL_MS) {
    return memoryCache.data;
  }

  try {
    const apiBase =
      process.env.NEXT_PUBLIC_GITHUB_API_PUBLIC ||
      process.env.GITHUB_API_PUBLIC ||
      "https://github-contributions-api.jogruber.de/v4/";
    const cleanBase = apiBase.endsWith("/") ? apiBase : `${apiBase}/`;
    const res = await fetch(`${cleanBase}${username}?y=all`);

    if (res.ok) {
      const json = await res.json();
      if (json?.total && typeof json.total === "object") {
        const totalCommits = Object.values(
          json.total as Record<string, number>
        ).reduce((acc, curr) => acc + (typeof curr === "number" ? curr : 0), 0);

        if (totalCommits > 0) {
          const val =
            totalCommits >= 1000
              ? parseFloat((totalCommits / 1000).toFixed(1))
              : totalCommits;
          const suffix = totalCommits >= 1000 ? "K+" : "+";
          const decimals = totalCommits >= 1000 ? 1 : 0;

          const stats: GitHubAllTimeStats = {
            totalCommits,
            formattedDisplay: {
              val,
              decimals,
              suffix,
            },
          };
          memoryCache = { data: stats, timestamp: now };
          return stats;
        }
      }
    }
  } catch (error) {
    console.warn("Failed to fetch dynamic GitHub commits stats, using fallback:", error);
  }

  return {
    totalCommits: 6733,
    formattedDisplay: {
      val: 6.7,
      decimals: 1,
      suffix: "K+",
    },
  };
}
