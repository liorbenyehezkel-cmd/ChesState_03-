"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { money } from "@/lib/dashboard/types";

const tooltipStyle = {
  background: "#0B1D33",
  border: "1px solid rgba(248,246,240,0.15)",
  borderRadius: 12,
  color: "#F8F6F0",
  fontSize: 13,
};

function axisMoney(value: number) {
  if (value >= 1000) return `$${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  return `$${value}`;
}

export function PortfolioArea({
  data,
}: {
  data: Array<{ month: string; value: number }>;
}) {
  const peak = Math.max(10, ...data.map((point) => point.value));
  const top = Math.ceil(peak / 10) * 10;

  return (
    <div className="h-56 w-full min-w-0 sm:h-64">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="portfolioFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F8F6F0" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#F8F6F0" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(248,246,240,0.06)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "#C4BFB3", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            domain={[0, top]}
            tick={{ fill: "#C4BFB3", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={axisMoney}
            width={48}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => [money(Number(value ?? 0)), "Illustrated value"]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#F8F6F0"
            fill="url(#portfolioFill)"
            strokeWidth={1.75}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RaisedArea({
  data,
  color = "#F8F6F0",
}: {
  data: Array<{ label: string; value: number }>;
  color?: string;
}) {
  const peak = Math.max(10, ...data.map((point) => point.value));
  const top = Math.ceil(peak / 10) * 10;
  const fillId = `raised-${color.replace("#", "")}`;

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            stroke={color === "#F8F6F0" ? "rgba(248,246,240,0.06)" : "rgba(11,29,51,0.08)"}
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fill: color, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            interval={0}
          />
          <YAxis
            domain={[0, top]}
            tick={{ fill: color, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
            width={48}
          />
          <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`$${String(value)}`, "Invested"]} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            fill={`url(#${fillId})`}
            strokeWidth={1.75}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function YieldBars({
  data,
}: {
  data: Array<{ year: string; estimate: number }>;
}) {
  return (
    <div className="h-52 w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(248,246,240,0.06)" vertical={false} />
          <XAxis dataKey="year" tick={{ fill: "#C4BFB3", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: "#C4BFB3", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
            width={40}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => [`${String(value)}%`, "Estimate"]}
          />
          <Bar dataKey="estimate" fill="#F8F6F0" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
