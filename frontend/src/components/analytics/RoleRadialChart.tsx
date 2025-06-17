import { PureComponent } from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";

const style = {
  top: "50%",
  right: 0,
  transform: "translate(0, -70%)",
  lineHeight: "24px",
};

interface Props {
  data: { name: string; count: number; fill: string }[];
}

export default class RoleRadialChart extends PureComponent<Props> {
  render() {
    return (
      <ResponsiveContainer>
        <RadialBarChart
          cx="30%"
          cy="60%"
          innerRadius="10%"
          outerRadius="80%"
          barSize={10}
          data={this.props.data}
          startAngle={180}
          endAngle={0}
        >
          <RadialBar
            label={{ fill: "white", position: "insideStart" }}
            background
            dataKey="count"
          />
          <Legend
            iconSize={10}
            layout="vertical"
            verticalAlign="middle"
            wrapperStyle={style}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    );
  }
}
