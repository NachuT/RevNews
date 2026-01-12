import { cn } from "@/lib/utils";

interface BiasMeterProps {
    rating: "Left" | "Center" | "Right" | "Mixed";
    className?: string;
}

export function BiasMeter({ rating, className }: BiasMeterProps) {
    const getBiasColor = (r: string) => {
        switch (r) {
            case "Left": return "bg-blue-600";
            case "Right": return "bg-red-600";
            case "Center": return "bg-purple-600";
            default: return "bg-gray-400";
        }
    };

    const getPosition = (r: string) => {
        switch (r) {
            case "Left": return "0%";
            case "Center": return "50%";
            case "Right": return "100%";
            default: return "50%"; // Mixed
        }
    };

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <span>Left</span>
                <span>Center</span>
                <span>Right</span>
            </div>
            <div className="h-3 bg-muted rounded-full relative overflow-hidden">
                {/* Gradient Background optional */}
                <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" />

                {/* Indicator */}
                <div
                    className={cn("absolute top-0 bottom-0 w-4 -ml-2 rounded-full border-2 border-white shadow-sm transition-all duration-500", getBiasColor(rating))}
                    style={{ left: getPosition(rating) }}
                />
            </div>
            <div className="text-center">
                <span className={cn("text-xs font-bold px-2 py-0.5 rounded-md text-white", getBiasColor(rating))}>
                    {rating === "Mixed" ? "Mixed / Balanced" : `${rating} Bias`}
                </span>
            </div>
        </div>
    );
}
