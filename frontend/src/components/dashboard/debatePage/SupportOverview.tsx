import { useMemo } from "react";
import { Pie, PieChart, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import type { ChartConfig } from "../../ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../ui/chart";
import type { SupportDetails } from "../../../types";

const COLORS = [
  "#8884d8", // Soft Purple
  "#82ca9d", // Soft Green
  "#ffc658", // Soft Yellow
  "#ff7f50", // Coral
  "#8dd1e1", // Soft Blue
  "#a4de6c", // Lime Green
  "#d0ed57", // Pastel Yellow
  "#ff8042", // Orange
];

const SupportOverview = ({ chartData }: { chartData: SupportDetails[] }) => {
  // Build chart config for ChartContainer
  const chartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {};

    chartData.forEach((stance, index) => {
      config[`stance-${stance.stanceId}`] = {
        label: stance.stanceLabel,
        color: COLORS[index % COLORS.length],
      };
    });

    return config;
  }, [chartData]);

  // Add colors to the chart data
  const chartDataWithColors = useMemo(
    () =>
      chartData.map((stance, index) => ({
        ...stance,
        fill: COLORS[index % COLORS.length],
      })),
    [chartData]
  );

  // Find leading stance
  const leadingStance =
    chartDataWithColors.length > 0
      ? chartDataWithColors.reduce((prev, current) =>
          prev.supportCount > current.supportCount ? prev : current
        )
      : null;

  const totalSupport = chartData.reduce(
    (sum, stance) => sum + stance.supportCount,
    0
  );

  return (
    <Card className="flex flex-col bg-neutral-900">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xl">Support Overview</CardTitle>
      </CardHeader>
      {totalSupport > 0 ? (
        <>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={chartDataWithColors}
                  dataKey="supportCount"
                  label
                  nameKey="stanceLabel"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                >
                  {chartDataWithColors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
              Currently leading:{" "}
              {leadingStance ? leadingStance.stanceLabel : "N/A"}
            </div>
            <div className="text-muted-foreground leading-none">
              Showing stances and their justification vote counts.
            </div>
          </CardFooter>
        </>
      ) : (
        <p className="text-muted-foreground">
          No support has been registered yet.
        </p>
      )}
    </Card>
  );
};

export default SupportOverview;
