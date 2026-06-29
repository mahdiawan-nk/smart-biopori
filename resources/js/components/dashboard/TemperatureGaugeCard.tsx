import {
    RadialBarChart,
    RadialBar,
    PolarAngleAxis,
    ResponsiveContainer,
} from "recharts";

import { Thermometer } from "lucide-react";

interface Props {
    /** Nilai suhu saat ini */
    value: number;

    /** Maksimum skala gauge */
    sensorMax?: number;

    /** Threshold minimum dari database */
    minThreshold?: number;

    /** Threshold maksimum dari database */
    maxThreshold?: number;
}

export default function TemperatureGaugeCard({
    value,
    sensorMax = 50,
    minThreshold = 20,
    maxThreshold = 35,
}: Props) {

    const gaugeValue = Math.min(
        Math.max((value / sensorMax) * 100, 0),
        100
    );

    const getStatus = () => {
        if (value < minThreshold) {
            return {
                label: "Dingin",
                color: "#3b82f6",
            };
        }

        if (value <= maxThreshold) {
            return {
                label: "Normal",
                color: "#22c55e",
            };
        }

        return {
            label: "Panas",
            color: "#ef4444",
        };
    };

    const status = getStatus();

    const data = [
        {
            value: gaugeValue,
        },
    ];

    return (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-foreground">
                        Suhu Tanah
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        Real-time
                    </p>
                </div>

                <div className="rounded-2xl bg-red-500/10 p-3">
                    <Thermometer className="h-5 w-5 text-red-500" />
                </div>
            </div>

            {/* Gauge */}
            <div className="relative h-[240px]">

                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        data={data}
                        startAngle={180}
                        endAngle={0}
                        innerRadius="70%"
                        outerRadius="100%"
                        barSize={18}
                    >
                        <PolarAngleAxis
                            type="number"
                            domain={[0, 100]}
                            tick={false}
                        />

                        <RadialBar
                            dataKey="value"
                            fill={status.color}
                            background
                            cornerRadius={30}
                        />
                    </RadialBarChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 top-12 flex flex-col items-center justify-center">

                    <div className="text-5xl font-bold text-foreground">
                        {value.toFixed(1)}°C
                    </div>

                    <div className="mt-1 text-sm text-muted-foreground">
                        Maks {sensorMax}°C
                    </div>

                    <div
                        className="mt-4 rounded-full px-3 py-1 text-sm font-semibold"
                        style={{
                            backgroundColor: `${status.color}20`,
                            color: status.color,
                        }}
                    >
                        {status.label}
                    </div>

                </div>

            </div>

            {/* Legend */}
            <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs">

                <div className="rounded-xl bg-blue-500/10 p-3 text-blue-500">
                    <div className="font-semibold">
                        Dingin
                    </div>

                    <div>
                        &lt; {minThreshold}°C
                    </div>
                </div>

                <div className="rounded-xl bg-green-500/10 p-3 text-green-500">
                    <div className="font-semibold">
                        Normal
                    </div>

                    <div>
                        {minThreshold} - {maxThreshold}°C
                    </div>
                </div>

                <div className="rounded-xl bg-red-500/10 p-3 text-red-500">
                    <div className="font-semibold">
                        Panas
                    </div>

                    <div>
                        &gt; {maxThreshold}°C
                    </div>
                </div>

            </div>

            {/* Progress */}
            <div className="mt-6">

                <div className="mb-2 flex justify-between text-sm text-muted-foreground">
                    <span>0°C</span>
                    <span>{sensorMax}°C</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                            width: `${gaugeValue}%`,
                            backgroundColor: status.color,
                        }}
                    />
                </div>

                <div className="mt-2 text-center text-sm text-muted-foreground">
                    {gaugeValue.toFixed(1)}% dari skala sensor
                </div>

            </div>

        </div>
    );
}