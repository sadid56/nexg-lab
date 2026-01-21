"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface ChartProps {
  monthlyTrend: { name: string; count: number }[];
}

export function DashboardCharts({ monthlyTrend }: ChartProps) {
  return (
    <div className='grid gap-6 lg:grid-cols-7 '>
      <Card className='col-span-7 border-muted/50 overflow-hidden group hover:shadow-lg transition-all duration-500 rounded-3xl'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>Blog Publication Trends</CardTitle>
          <CardDescription className='text-base'>Content growth overview for the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='h-[400px] w-full pt-6'>
            <ResponsiveContainer width='100%' height='100%'>
              <AreaChart data={monthlyTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id='colorCount' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#3b82f6' stopOpacity={0.3} />
                    <stop offset='50%' stopColor='#3b82f6' stopOpacity={0.1} />
                    <stop offset='95%' stopColor='#3b82f6' stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#e2e8f0' />
                <XAxis dataKey='name' axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: "#64748b", fontWeight: 500 }} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: "#64748b", fontWeight: 500 }} dx={-10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                    padding: "12px 16px",
                  }}
                  itemStyle={{ color: "#3b82f6", fontWeight: 700 }}
                  labelStyle={{ marginBottom: "4px", fontWeight: 600 }}
                  cursor={{ stroke: "#3b82f6", strokeWidth: 2, strokeDasharray: "5 5" }}
                />
                <Area
                  type='monotone'
                  dataKey='count'
                  stroke='#3b82f6'
                  strokeWidth={4}
                  fillOpacity={1}
                  fill='url(#colorCount)'
                  animationDuration={2000}
                  dot={{ r: 6, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 8, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
