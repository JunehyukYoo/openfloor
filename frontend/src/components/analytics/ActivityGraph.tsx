import { PureComponent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: {
    date: string;
    debates: number;
    justifications: number;
    comments: number;
    votes: number;
  }[];
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?:
    | Array<{
        name: string;
        value: number;
        color: string;
      }>
    | undefined;
  label?: string;
}) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-zinc-800 border border-zinc-600 text-zinc-100 rounded-md px-4 py-2 shadow-lg text-sm">
      <div className="text-zinc-200 font-semibold mb-2">{label}</div>
      {payload.map((entry, i) => (
        <div key={i} className="text-zinc-300 flex items-center gap-2">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="capitalize">{entry.name}:</span>{" "}
          <span className="font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default class ActivityGraph extends PureComponent<Props> {
  render() {
    return (
      <div className="w-full h-full flex items-center justify-center overflow-hidden">
        <ResponsiveContainer width="95%" height={300}>
          <LineChart
            data={this.props.data}
            margin={{
              top: 0,
              right: 50,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              wrapperStyle={{
                paddingBottom: 10,
              }}
            />
            <Line
              type="monotone"
              dataKey="debates"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="justifications"
              stroke="#90cdf4"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="comments"
              stroke="#82ca9d"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="votes"
              stroke="#f5d742"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
