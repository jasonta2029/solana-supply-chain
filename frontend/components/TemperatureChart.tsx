import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
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
        <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 20,
                        left: 0,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2e38" />
                    <XAxis
                        dataKey="timestamp"
                        stroke="#6b7280"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <YAxis
                        stroke="#6b7280"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1a1d24', border: 'none', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#14F195' }}
                    />

                    {maxTemp !== undefined && (
                        <ReferenceLine y={maxTemp} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Max', fill: '#ef4444', fontSize: 12 }} />
                    )}
                    {minTemp !== undefined && (
                        <ReferenceLine y={minTemp} stroke="#3b82f6" strokeDasharray="3 3" label={{ position: 'insideBottomLeft', value: 'Min', fill: '#3b82f6', fontSize: 12 }} />
                    )}

                    <Line
                        type="monotone"
                        dataKey="temperature"
                        stroke="#14F195"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#14F195', strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: '#fff' }}
                        name="Temp (°C)"
                    />
                    <Line
                        type="monotone"
                        dataKey="humidity"
                        stroke="#9945FF"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#9945FF', strokeWidth: 0 }}
                        name="Humidity (%)"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
