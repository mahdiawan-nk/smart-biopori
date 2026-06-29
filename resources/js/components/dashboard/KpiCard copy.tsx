import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface KpiCardProps {
    title: string;
    value: string;
    trend: string;
    status: string;
    icon: React.ElementType;
    color: string;
}

export default function KpiCard({
    title,
    value,
    trend,
    status,
    icon: Icon,
    color,
}: KpiCardProps) {
    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-3xl",
                "border border-border/50",
                "bg-background/80 backdrop-blur-xl",
                "shadow-sm transition-all duration-300",
                "hover:-translate-y-1 hover:shadow-xl",
                "min-w-0" // penting untuk grid responsive
            )}
        >
            <div
                className={cn(
                    "absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl opacity-10",
                    color // Langsung masukkan string class gradient utuh di sini
                )}
            />
            <div className="relative p-4 sm:p-5 lg:p-6">
                <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-xs sm:text-sm text-muted-foreground">
                            {title}
                        </p>

                        <h2
                            className={cn(
                                "mt-2 font-bold tracking-tight",
                                "text-md sm:text-3xl lg:text-4xl",
                                "truncate"
                            )}
                        >
                            {value}
                        </h2>
                    </div>

                    <div
                        className={cn(
                            "flex shrink-0 items-center justify-center rounded-2xl",
                            "h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14",
                            color, // Langsung masukkan string class gradient utuh di sini
                            "text-white shadow-lg"
                        )}
                    >
                        <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
                    </div>

                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">

                    <div className="flex items-center gap-2 rounded-full bg-muted px-2 py-1 sm:px-3">

                        <span className="text-xs sm:text-sm font-medium">
                            {trend}
                        </span>
                    </div>

                    <span className="text-xs sm:text-sm text-muted-foreground">
                        {status}
                    </span>

                </div>
            </div>
        </div>
    );
}