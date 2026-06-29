// resources/js/Components/Dashboard/ChartCard.tsx

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

interface ChartData {
    time: string;
    [key: string]: string | number;
}

interface ChartCardProps {
    title: string;
    data?: ChartData[];
    dataKey: string;
    color?: string;
}

export default function ChartCard({
    title,
    data = [],
    dataKey,
    color = "#22c55e",
}: ChartCardProps) {
    return (
        <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="mb-4">
                <h3 className="text-lg font-semibold">
                    {title}
                </h3>
            </div>

            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="time" />

                        <YAxis />

                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey={dataKey}
                            stroke={color}
                            strokeWidth={3}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}