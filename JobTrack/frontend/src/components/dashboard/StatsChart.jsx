// This component renders the bar chart for the Student dashboard using Recharts.
// Each bar is clickable and informs the parent which status should be highlighted.

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

// Mapping between status keys and human-readable labels/colors.
const STATUS_CONFIG = {
  applied: { label: "Applied", color: "#f97316" }, // orange
  rejected: { label: "Rejected", color: "#ef4444" }, // red
  selected: { label: "Selected", color: "#22c55e" } // green
};

export const StatsChart = ({ stats, onBarClick }) => {
  // Prepare data for Recharts; only include the three main bars requested.
  const data = [
    {
      key: "applied",
      label: STATUS_CONFIG.applied.label,
      value: stats.applied
    },
    {
      key: "rejected",
      label: STATUS_CONFIG.rejected.label,
      value: stats.rejected
    },
    {
      key: "selected",
      label: STATUS_CONFIG.selected.label,
      value: stats.selected
    }
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h2>Application Overview</h2>
        <p>Click a bar to filter the list below.</p>
      </div>
      <div className="card-body chart-container">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="label" tick={{ fill: "#9ca3af" }} />
            <YAxis allowDecimals={false} tick={{ fill: "#9ca3af" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                borderRadius: 8,
                border: "1px solid #1f2937"
              }}
            />
            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
              onClick={(dataPoint) => onBarClick?.(dataPoint.key)}
            >
              {data.map((entry, index) => (
                <cell
                  // Recharts expects a `Cell` component; here we match bars by index.
                  // This section is kept simple for readability.
                  key={index}
                  fill={STATUS_CONFIG[entry.key].color}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

