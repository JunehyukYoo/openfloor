import type { AnalyticsData } from "../types";

// Formats raw json data from backend into data
// usable by RadialBarChart (Recharts) at routes/analytics.tsx
export function processDebateBreakdown(data: AnalyticsData) {
  const roles = ["CREATOR", "ADMIN", "DEBATER", "OBSERVER"];
  const roleColorMap: Record<string, string> = {
    DEBATER: "#8884d8",
    ADMIN: "#82ca9d",
    OBSERVER: "#ffc658",
    CREATOR: "#dfc45e",
  };
  // Convert raw stats to a role -> count map
  const statsMap = new Map<string, number>();
  data.participation.participantStats.forEach((stat) =>
    statsMap.set(stat.role, stat._count)
  );
  return roles.map((role) => {
    const count = statsMap.get(role) ?? 0;
    return {
      name: role.charAt(0).toUpperCase() + role.slice(1),
      count,
      fill: roleColorMap[role],
      fillOpacity: count === 0 ? 0.3 : 1,
    };
  });
}

// DEPRECIATED (NOT USING ANYMORE)
// Slice away the year off the date
export function processActivityData(data: AnalyticsData) {
  return data.activityOverTime.map((d) => ({ ...d, date: d.date.slice(5) }));
}

// Generates random line data for feature cards in home page
export function generateRandomData(
  length: number,
  base: number,
  variation: number
) {
  return Array.from({ length }, (_, i) => ({
    name: i,
    num: Math.floor(
      base + Math.sin(i / 2 + base / 3) * variation + Math.random() * variation
    ),
  }));
}
