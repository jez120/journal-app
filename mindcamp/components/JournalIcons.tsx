import React from 'react';
import Image from "next/image";

// --- SHARED PROPS ---
export interface IconProps {
    size?: number;
    className?: string;
    // Color prop is deprecated for these full-color icons but kept for compatibility
    color?: string;
}

const IconImage = ({ src, alt, size = 24, className = "" }: { src: string, alt: string, size?: number, className?: string }) => (
    <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={className}
        unoptimized // Required for SVGs in some Next.js configs or to avoid unnecessary processing
    />
);

// ============================================================================
// BRANDING & CORE (Identity)
// ============================================================================

export function AppLogo({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <Image
            src="/icons/AppLogo.png"
            alt="Clarity Journal"
            width={40}
            height={40}
            className={`${className} rounded-lg`}
            unoptimized
        />
    );
}

export const SparkleIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/SparkleIcon.png" alt="Sparkle" size={size} className={className} />
);

// ============================================================================
// PROGRESS & STREAKS
// ============================================================================

export const FireIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/FireIcon.png" alt="Fire" size={size} className={className} />
);

export const BoltIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/BoltIcon.png" alt="Bolt" size={size} className={className} />
);

export const TargetIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/TargetIcon.png" alt="Target" size={size} className={className} />
);

export const TrophyIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/TrophyIcon.png" alt="Trophy" size={size} className={className} />
);

export const TrackIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/TrackIcon.png" alt="Track" size={size} className={className} />
);

// ============================================================================
// ACTIVITIES & TOOLS
// ============================================================================

export const WriteIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/WriteIcon.png" alt="Write" size={size} className={className} />
);

export const ReadIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/ReadIcon.png" alt="Read" size={size} className={className} />
);

export const HabitIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/HabitIcon.png" alt="Habit" size={size} className={className} />
);

export const TicketIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/TicketIcon.png" alt="Ticket" size={size} className={className} />
);

// ============================================================================
// INTELLECT & MIND
// ============================================================================

export const InsightsIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/InsightsIcon.png" alt="Insights" size={size} className={className} />
);

export const LightbulbIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/LightbulbIcon.png" alt="Idea" size={size} className={className} />
);

export const UnderstandIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/UnderstandIcon.png" alt="Understand" size={size} className={className} />
);

export const ReflectIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/ReflectIcon.png" alt="Reflect" size={size} className={className} />
);

export const MeditateIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/MeditateIcon.png" alt="Meditate" size={size} className={className} />
);

// ============================================================================
// TIME & CALENDAR
// ============================================================================

export const CalendarIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/CalendarIcon.png" alt="Calendar" size={size} className={className} />
);

export const TodayIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/TodayIcon.png" alt="Today" size={size} className={className} />
);

export const YesterdayIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/YesterdayIcon.png" alt="Yesterday" size={size} className={className} />
);

// ============================================================================
// UI & NAVIGATION
// ============================================================================

export const BackIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/BackIcon.png" alt="Back" size={size} className={className} />
);

export const ForwardIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/ForwardIcon.png" alt="Forward" size={size} className={className} />
);

export const ChevronDownIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/ChevronDownIcon.png" alt="Down" size={size} className={className} />
);

export const CloseIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/CloseIcon.png" alt="Close" size={size} className={className} />
);

export const CheckIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/CheckIcon.png" alt="Check" size={size} className={className} />
);

export const WarningIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/WarningIcon.png" alt="Warning" size={size} className={className} />
);
