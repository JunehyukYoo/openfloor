import type { AnalyticsData } from "../types";

// Formats raw json data from backend into data
// usable by RadialBarChart (Recharts) at routes/analytics.tsx
export function processDebateBreakdown(data: AnalyticsData) {
  const roles = ["admin", "debater", "observer"];
  const roleColorMap: Record<string, string> = {
    debater: "#8884d8",
    admin: "#82ca9d",
    observer: "#ffc658",
  };
  // Convert raw stats to a role => count map
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

// Slice away the year off the date
export function processActivityData(data: AnalyticsData) {
  return data.activityOverTime.map((d) => ({ ...d, date: d.date.slice(5) }));
}
