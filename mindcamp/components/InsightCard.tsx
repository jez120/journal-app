"use client";

import { useState } from "react";

interface Insight {
    type: "keyword" | "milestone" | "pattern" | "comparison" | "encouragement" | "sentiment" | "dayofweek";
    title: string;
    content: string;
}

interface InsightCardProps {
    insight: Insight;
    onDismiss?: () => void;
}

export default function InsightCard({ insight, onDismiss }: InsightCardProps) {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    const handleDismiss = () => {
        setIsVisible(false);
        onDismiss?.();
    };

    // Get icon and colors based on insight type
    const getTypeStyles = () => {
        switch (insight.type) {
            case "milestone":
                return {
                    bg: "bg-yellow-500/10",
                    border: "border-yellow-500/20",
                    icon: "🏆",
                    iconBg: "bg-yellow-500/20",
                };
            case "keyword":
                return {
                    bg: "bg-blue-500/10",
                    border: "border-blue-500/20",
                    icon: "💡",
                    iconBg: "bg-blue-500/20",
                };
            case "comparison":
                return {
                    bg: "bg-green-500/10",
                    border: "border-green-500/20",
                    icon: "📈",
                    iconBg: "bg-green-500/20",
                };
            case "pattern":
                return {
                    bg: "bg-purple-500/10",
                    border: "border-purple-500/20",
                    icon: "🔮",
                    iconBg: "bg-purple-500/20",
                };
            case "sentiment":
                return {
                    bg: "bg-pink-500/10",
                    border: "border-pink-500/20",
                    icon: "💭",
                    iconBg: "bg-pink-500/20",
                };
            case "dayofweek":
                return {
                    bg: "bg-cyan-500/10",
                    border: "border-cyan-500/20",
                    icon: "📅",
                    iconBg: "bg-cyan-500/20",
                };
            case "encouragement":
            default:
                return {
                    bg: "bg-white/5",
                    border: "border-white/10",
                    icon: "✨",
                    iconBg: "bg-white/10",
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div
            className={`${styles.bg} ${styles.border} border rounded-2xl p-4 relative animate-fadeIn`}
        >
            <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 text-white/40 hover:text-white/60 transition-colors"
                aria-label="Dismiss insight"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div className="flex items-start gap-3">
                <div className={`${styles.iconBg} w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>
                    {styles.icon}
                </div>
                <div className="flex-1 pr-6">
                    <h3 className="text-white/90 font-medium mb-1">
                        {insight.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                        {insight.content}
                    </p>
                </div>
            </div>
        </div>
    );
}

// Container for multiple insights
interface InsightsContainerProps {
    insights: Insight[];
    onDismiss?: (index: number) => void;
}

export function InsightsContainer({ insights, onDismiss }: InsightsContainerProps) {
    if (insights.length === 0) return null;

    return (
        <div className="space-y-3">
            <h2 className="text-white/50 text-sm font-medium uppercase tracking-wide">
                Insights
            </h2>
            {insights.map((insight, index) => (
                <InsightCard
                    key={`${insight.type}-${index}`}
                    insight={insight}
                    onDismiss={() => onDismiss?.(index)}
                />
            ))}
        </div>
    );
}
