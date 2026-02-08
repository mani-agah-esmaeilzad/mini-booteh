"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { toPersianDigits } from "@/lib/i18n/format";

type Bucket = { bucket: string; count: number };

export function FocusDistributionChart({ data }: { data: Bucket[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data}>
        <XAxis dataKey="bucket" />
        <YAxis allowDecimals={false} tickFormatter={(value) => toPersianDigits(value)} />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip
          formatter={(value: number | string | undefined) =>
            toPersianDigits(typeof value === "number" || typeof value === "string" ? value : 0)
          }
        />
        <Area
          dataKey="count"
          stroke="hsl(var(--accent))"
          fill="hsl(var(--accent))"
          fillOpacity={0.2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
