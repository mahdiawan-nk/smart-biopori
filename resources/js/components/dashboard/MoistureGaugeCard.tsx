import {
    RadialBarChart,
    RadialBar,
    PolarAngleAxis,
    ResponsiveContainer,
} from "recharts";

import { Droplets } from "lucide-react";

interface Props {
    /** Nilai sensor saat ini */
    value: number;

    /** Nilai maksimum sensor (misal 120) */
    sensorMax?: number;

    /** Threshold minimum dari database */
    minThreshold?: number;

    /** Threshold maksimum dari database */
    maxThreshold?: number;
}

export default function MoistureGaugeCard({
    value,
    sensorMax = 120,
    minThreshold = 40,
    maxThreshold = 80,
}: Props) {

    // Hitung persentase untuk gauge
    const gaugeValue = Math.min(
        Math.max((value / sensorMax) * 100, 0),
        100
    );

    const getStatus = () => {
        if (value < minThreshold) {
            return {
                label: "Kering",
                color: "#ef4444",
            };
        }

        if (value <= maxThreshold) {
            return {
                label: "Normal",
                color: "#f59e0b",
            };
        }

        return {
            label: "Basah",
            color: "#22c55e",
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
                        Kelembapan Tanah
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        Kondisi saat ini
                    </p>
                </div>

                <div className="rounded-2xl bg-blue-500/10 p-3">
                    <Droplets className="h-5 w-5 text-blue-500" />
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
                            background
                            dataKey="value"
                            fill={status.color}
                            cornerRadius={30}
                        />
                    </RadialBarChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 top-12 flex flex-col items-center justify-center">

                    <div className="text-5xl font-bold text-foreground">
                        {value}
                    </div>

                    <div className="mt-1 text-sm text-muted-foreground">
                        / {sensorMax}
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

                <div className="rounded-xl bg-red-500/10 p-3 text-red-500">
                    <div className="font-semibold">Kering</div>

                    <div>
                        &lt; {minThreshold}
                    </div>
                </div>

                <div className="rounded-xl bg-amber-500/10 p-3 text-amber-500">
                    <div className="font-semibold">
                        Normal
                    </div>

                    <div>
                        {minThreshold} - {maxThreshold}
                    </div>
                </div>

                <div className="rounded-xl bg-green-500/10 p-3 text-green-500">
                    <div className="font-semibold">
                        Basah
                    </div>

                    <div>
                        &gt; {maxThreshold}
                    </div>
                </div>

            </div>

            {/* Progress */}
            <div className="mt-6">

                <div className="mb-2 flex justify-between text-sm text-muted-foreground">
                    <span>0</span>
                    <span>{sensorMax}</span>
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
                    {gaugeValue.toFixed(1)}% dari kapasitas sensor
                </div>

            </div>

        </div>
    );
}