import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    AreaChart,
    Area
} from 'recharts';

interface Reading {
    timestamp: string;
    temperature: number;
    humidity: number;
}

interface ChartProps {
    data: Reading[];
    maxTemp?: number;
    minTemp?: number;
}

export const TemperatureChart: React.FC<ChartProps> = ({ data, maxTemp, minTemp }) => {
    return (
        <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 10,
                        left: -20,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0052FF" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#0052FF" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                        dataKey="timestamp"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#0f172a',
                            border: 'none',
                            borderRadius: '12px',
                            color: '#fff',
                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                            padding: '12px'
                        }}
                        labelStyle={{ display: 'none' }}
                        itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    />

                    {maxTemp !== undefined && (
                        <ReferenceLine y={maxTemp} stroke="#ef4444" strokeDasharray="4 4" label={{ position: 'right', value: '▲ MAX', fill: '#ef4444', fontSize: 8, fontWeight: 'bold', letterSpacing: '0.1em' }} />
                    )}

                    <Area
                        type="monotone"
                        dataKey="temperature"
                        stroke="#0052FF"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorTemp)"
                        activeDot={{ r: 6, fill: '#0052FF', stroke: '#fff', strokeWidth: 2 }}
                        name="Temperature (°C)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
