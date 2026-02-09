
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface ReportChartsProps {
    metrics: any[];
}

export function ReportCharts({ metrics }: ReportChartsProps) {
    if (!metrics || metrics.length === 0) return null;

    // Prepare data for chart
    const data = metrics.map(m => ({
        name: m.subscale,
        score: m.score,
        max: m.maxScore,
        percent: Math.round((m.score / m.maxScore) * 100),
        risk: m.riskBand
    }));

    const getColor = (risk: string) => {
        if (risk === "high") return "#ef4444";
        if (risk === "moderate") return "#eab308";
        return "#22c55e";
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>نمودار خرده‌مقیاس‌ها</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 100 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" domain={[0, 100]} unit="%" />
                            <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                            <Tooltip
                                formatter={(value: number | string | undefined) => [
                                    `${typeof value === "number" ? value : Number(value ?? 0)}%`,
                                    "نمره",
                                ]}
                                cursor={{ fill: 'transparent' }}
                            />
                            <Bar dataKey="percent" radius={[0, 4, 4, 0]} barSize={20}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getColor(entry.risk)} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 text-center">
                    {data.map((d, i) => (
                        <div key={i} className="bg-muted/30 p-2 rounded">
                            <div className="text-xs text-muted-foreground">{d.name}</div>
                            <div className="font-bold">{d.score} / {d.max}</div>
                            <div className="text-[10px]" style={{ color: getColor(d.risk) }}>
                                {d.risk === 'high' ? 'بالا' : d.risk === 'moderate' ? 'متوسط' : 'کم'}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
