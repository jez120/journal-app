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
    <IconImage src="/icons/SparkleIcon.svg" alt="Sparkle" size={size} className={className} />
);

// ============================================================================
// PROGRESS & STREAKS
// ============================================================================

export const FireIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/FireIcon.svg" alt="Fire" size={size} className={className} />
);

export const BoltIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/BoltIcon.svg" alt="Bolt" size={size} className={className} />
);

export const TargetIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/TargetIcon.svg" alt="Target" size={size} className={className} />
);

export const TrophyIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/TrophyIcon.svg" alt="Trophy" size={size} className={className} />
);

export const TrackIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/TrackIcon.svg" alt="Track" size={size} className={className} />
);

// ============================================================================
// ACTIVITIES & TOOLS
// ============================================================================

export const WriteIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/WriteIcon.svg" alt="Write" size={size} className={className} />
);

export const ReadIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/ReadIcon.svg" alt="Read" size={size} className={className} />
);

export const HabitIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/HabitIcon.svg" alt="Habit" size={size} className={className} />
);

export const TicketIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/TicketIcon.svg" alt="Ticket" size={size} className={className} />
);

// ============================================================================
// INTELLECT & MIND
// ============================================================================

export const InsightsIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/InsightsIcon.svg" alt="Insights" size={size} className={className} />
);

export const LightbulbIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/LightbulbIcon.svg" alt="Idea" size={size} className={className} />
);

export const UnderstandIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/UnderstandIcon.svg" alt="Understand" size={size} className={className} />
);

export const ReflectIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/ReflectIcon.svg" alt="Reflect" size={size} className={className} />
);

export const MeditateIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/MeditateIcon.svg" alt="Meditate" size={size} className={className} />
);

// ============================================================================
// TIME & CALENDAR
// ============================================================================

export const CalendarIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/CalendarIcon.svg" alt="Calendar" size={size} className={className} />
);

export const TodayIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/TodayIcon.svg" alt="Today" size={size} className={className} />
);

export const YesterdayIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/YesterdayIcon.svg" alt="Yesterday" size={size} className={className} />
);

// ============================================================================
// UI & NAVIGATION
// ============================================================================

export const BackIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/BackIcon.svg" alt="Back" size={size} className={className} />
);

export const ForwardIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/ForwardIcon.svg" alt="Forward" size={size} className={className} />
);

export const ChevronDownIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/ChevronDownIcon.svg" alt="Down" size={size} className={className} />
);

export const CloseIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/CloseIcon.svg" alt="Close" size={size} className={className} />
);

export const CheckIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/CheckIcon.svg" alt="Check" size={size} className={className} />
);

export const WarningIcon = ({ size, className }: IconProps) => (
    <IconImage src="/icons/WarningIcon.svg" alt="Warning" size={size} className={className} />
);
