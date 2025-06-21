"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "../../hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import type { ChartConfig } from "../ui/chart";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import type { ActivityOverTime } from "../../types";

const chartConfig = {
  activity: {
    label: "Activity",
  },
  debates: {
    label: "Debates",
    color: "var(--primary)",
  },
  justifications: {
    label: "Justifications",
    color: "var(--primary)",
  },
  comments: {
    label: "Comments",
    color: "var(--primary)",
  },
  votes: {
    label: "Votes",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive({
  chartData,
}: {
  chartData: ActivityOverTime[];
}) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date();
    console.log(referenceDate.toISOString());
    console.log("hello");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Activity</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDebates" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="purple" stopOpacity={1.0} />
                <stop offset="95%" stopColor="purple" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient
                id="fillJustifications"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="green" stopOpacity={0.8} />
                <stop offset="95%" stopColor="green" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillComments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="blue" stopOpacity={0.8} />
                <stop offset="95%" stopColor="blue" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillVotes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="yellow" stopOpacity={0.8} />
                <stop offset="95%" stopColor="yellow" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="debates"
              type="natural"
              fill="url(#fillDebates)"
              stroke="purple"
              stackId="a"
            />
            <Area
              dataKey="justifications"
              type="natural"
              fill="url(#fillJustifications)"
              stroke="blue"
              stackId="a"
            />
            <Area
              dataKey="comments"
              type="natural"
              fill="url(#fillComments)"
              stroke="green"
              stackId="a"
            />
            <Area
              dataKey="votes"
              type="natural"
              fill="url(#fillVotes)"
              stroke="yellow"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
