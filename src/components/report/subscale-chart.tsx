"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { TotalsPayload } from "@/lib/scoring";
import { toPersianDigits } from "@/lib/i18n/format";

export function SubscaleChart({ data }: { data: TotalsPayload["subscales"] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => toPersianDigits(value)} />
        <Tooltip
          formatter={(value: number | string | undefined) =>
            toPersianDigits(typeof value === "number" || typeof value === "string" ? value : 0)
          }
        />
        <Bar dataKey="normalizedScore" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
