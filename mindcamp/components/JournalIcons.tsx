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

// ============================================================================
// SYSTEM & ACTIONS (Apple-style SVG Icons)
// ============================================================================

export const SettingsIcon = ({ size = 24, className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

export const EditIcon = ({ size = 24, className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

export const DeleteIcon = ({ size = 24, className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
);

export const ExportIcon = ({ size = 24, className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
);

export const DownloadIcon = ({ size = 24, className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

export const UserIcon = ({ size = 24, className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

export const ThemeIcon = ({ size = 24, className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

export const ChartIcon = ({ size = 24, className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
);

export const CircleIcon = ({ size = 24, className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="9" />
    </svg>
);

export const CheckCircleIcon = ({ size = 24, className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);
