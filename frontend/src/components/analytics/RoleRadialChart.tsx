// RoleRadialChart.tsx
// https://recharts.org/en-US/api/RadialBarChart
import { PureComponent } from "react";
import {
  RadialBarChart,
  RadialBar,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { name: string; count: number } }[];
}) => {
  if (active && payload && payload.length) {
    const { name, count } = payload[0].payload;
    return (
      <div className="bg-zinc-800 text-white text-sm p-2 rounded shadow">
        <p className="font-semibold capitalize">{name}</p>
        <p>Count: {count}</p>
      </div>
    );
  }
  return null;
};

interface Props {
  data: { name: string; count: number; fill: string }[];
}

export default class RoleRadialChart extends PureComponent<Props> {
  render() {
    return (
      <ResponsiveContainer>
        <RadialBarChart
          cx="50%"
          cy="90%"
          innerRadius={30}
          outerRadius={120}
          barSize={20}
          data={this.props.data}
          startAngle={180}
          endAngle={0}
        >
          <RadialBar
            label={{ fill: "white", position: "insideTop" }}
            background
            dataKey="count"
          />
          <Tooltip content={<CustomTooltip />} />
        </RadialBarChart>
      </ResponsiveContainer>
    );
  }
}
