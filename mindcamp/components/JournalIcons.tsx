import React from 'react';
import Image from "next/image";

// --- SHARED PROPS & WRAPPER ---
// All icons use this wrapper for consistent sizing and 2px stroke style.
export interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
    /** Primary stroke color, defaults to current text color */
    color?: string;
}

const SvgIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", children, ...props }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        {children}
    </svg>
);

// ============================================================================
// BRANDING & CORE (Identity)
// ============================================================================

export function AppLogo({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <Image
            src="/icon.png"
            alt="Clarity Journal"
            width={40}
            height={40}
            className={`${className} rounded-lg`}
            unoptimized
        />
    );
}

export const SparkleIcon = (props: IconProps) => (
    <SvgIcon {...props} color="#FBBF24"> {/* Warm Yellow */}
        {/* Classic star sparkles */}
        <path d="M12 3V7" />
        <path d="M16 11H20" />
        <path d="M12 15V19" />
        <path d="M8 11H4" />
        <path d="M17 5L17.5 6L18.5 6.5L17.5 7L17 8L16.5 7L15.5 6.5L16.5 6L17 5Z" fill="#FBBF24" stroke="none" />
        <path d="M12 11L14 9M12 11L10 13M12 11L14 13M12 11L10 9" />
    </SvgIcon>
);

// ============================================================================
// PROGRESS & STREAKS (Motivating Warm Colors)
// ============================================================================

export const FireIcon = (props: IconProps) => (
    <SvgIcon {...props} color="#F97316"> {/* Orange */}
        {/* A clear, recognizable flame */}
        <path d="M12 21C15.5 21 19 17 19 12C19 7.5 16 5 12 2C8 5 5 7.5 5 12C5 17 8.5 21 12 21Z" fill="#FFEDD5" />
        <path d="M12 16C13.1 16 14 15.1 14 14C14 12.9 13.1 12 12 12C10.9 12 10 12.9 10 14C10 15.1 10.9 16 12 16Z" fill="#F97316" stroke="none" />
    </SvgIcon>
);

export const BoltIcon = (props: IconProps) => (
    <SvgIcon {...props} color="#EAB308"> {/* Yellow */}
        {/* A sharp lightning bolt */}
        <path d="M13 2L6 14H12L11 22L18 10H12L13 2Z" fill="#FEF9C3" />
    </SvgIcon>
);

export const TargetIcon = (props: IconProps) => (
    <SvgIcon {...props} color="#EF4444"> {/* Red */}
        {/* An archery target with an arrow hitting the center */}
        <circle cx="12" cy="12" r="10" fill="#FEE2E2" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" fill="#EF4444" stroke="none" />
        <path d="M12 12L20 4M20 4H16M20 4V8" />
    </SvgIcon>
);

export const TrophyIcon = (props: IconProps) => (
    <SvgIcon {...props} color="#F59E0B"> {/* Gold/Amber */}
        {/* A champion's cup */}
        <path d="M8 21H16M12 17V21M17 4H19C20.1 4 21 4.9 21 6V9C21 10.1 20.1 11 19 11H17M5 4H7M7 4C7 4 7 13 12 13C17 13 17 4 17 4M7 4H17" fill="#FEF3C7" />
        <path d="M5 4H3C1.9 4 1 4.9 1 6V9C1 10.1 1.9 11 3 11H5" />
    </SvgIcon>
);

export const TrackIcon = (props: IconProps) => (
    <SvgIcon {...props} color="#10B981"> {/* Green */}
        {/* A rising bar chart showing growth */}
        <path d="M12 20V10" />
        <path d="M18 20V4" />
        <path d="M6 20V16" />
        <path d="M4 20H20" />
    </SvgIcon>
);

// ============================================================================
// ACTIVITIES & TOOLS (Neutral & Descriptive Colors)
// ============================================================================

export const WriteIcon = (props: IconProps) => (
    <SvgIcon {...props} color="#8B5CF6"> {/* Purple */}
        {/* A pen writing on a piece of paper */}
        <path d="M17 3A2.828 2.828 0 1 1 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z" fill="#EDE9FE" />
        <path d="M11 20H21" />
    </SvgIcon>
);

export const ReadIcon = (props: IconProps) => (
    <SvgIcon {...props} color="#6B7280"> {/* Cool Grey */}
        {/* An open book */}
        <path d="M2 3H8C10.2 3 12 4.8 12 7V21C12 18.8 10.2 17 8 17H2V3Z" fill="#F3F4F6" />
        <path d="M22 3H16C13.8 3 12 4.8 12 7V21C12 18.8 13.8 17 16 17H22V3Z" fill="#F3F4F6" />
    </SvgIcon>
);

export const HabitIcon = (props: IconProps) => (
    <SvgIcon {...props} color="#6366F1"> {/* Indigo */}
        {/* Arrows moving in a continuous loop */}
        <path d="M21 12C21 16.9706 16.9706 21 12 21C9.6 21 7.4 20.1 5.8 18.5L4 20" />
        <path d="M3 12C3 7.02944 7.02944 3 12 3C14.4 3 16.6 3.9 18.2 5.5L20 4" />
        <path d="M8 12H16M16 12L13 9M16 12L13 15" /> {/* Center progress arrow */}
        <path d="M16 4V8H20" />
        <path d="M8 20V16H4" />
    </SvgIcon>
);

export const TicketIcon = (props: IconProps) => (
    <SvgIcon {...props} color="#EC4899"> {/* Pink */}
        {/* A classic admission ticket with punched holes */}
        <path d="M13 5H19V19H13M13 5C13 7.76142 10.7614 10 8 10M13 5C13 2.23858 10.7614 0 8 0M13 19C13 16.2386 10.7614 14 8 14M13 19C13 21.7614 10.7614 24 8 24M8 10V14M8 0V10M8 14V24M5 5H8M5 19H8" fill="#FCE7F3" />
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M6 5V19M18 5V19" strokeDasharray="2 2" />
        <circle cx="2" cy="12" r="2" fill="white" stroke="none" />
        <circle cx="22" cy="12" r="2" fill="white" stroke="none" />
        <path d="M2 12C2 10 4 10 4 12C4 14 2 14 2 12Z" />
        <path d="M22 12C22 10 20 10 20 12C20 14 22 14 22 12Z" />
    </SvgIcon>
);

// ============================================================================
// INTELLECT & MIND (Deep Blues & Purples)
// ============================================================================

export const InsightsIcon = (props: IconProps) => (
    <SvgIcon {...props} color="#8B5CF6">
        {/* A magnifying glass revealing data points */}
        <circle cx="11" cy="11" r="8" fill="#EDE9FE" />
        <path d="M21 21L16.65 16.65" />
        <path d="M11 7V11M11 11H15M11 15H7" />
        <circle cx="11" cy="11" r="2" fill="#8B5CF6" stroke="none" />
    </SvgIcon>
);

export const LightbulbIcon = (props: IconProps) => (
    <SvgIcon {...props} color="#F59E0B">
        {/* A glowing idea bulb */}
        <path d="M9 21H15M12 17V21" />
        <path d="M12 3C8.13401 3 5 6.13401 5 10C5 12.6 6.4 14.8 8.5 16H15.5C17.6 14.8 19 12.6 19 10C19 6.13401 15.866 3 12 3Z" fill="#FEF3C7" />
        <path d="M12 7V9" />
        <path d="M9 10H10" />
        <path d="M14 10H15" />
    </SvgIcon>
);

export const UnderstandIcon = (props: IconProps) => (
    <SvgIcon {...props} color="#06B6D4"> {/* Cyan */}
        {/* A head profile with a gear inside, indicating thought process */}
        <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" />
        <path d="M14.5 9.5L16 8M14.5 14.5L16 16M9.5 14.5L8 16M9.5 9.5L8 8" />
        <path d="M20.24 12.24C21.366 11.114 22 9.62601 22 8C22 4.68629 19.3137 2 16 2C14.374 2 12.886 2.63401 11.76 3.76C8.32 3.01 5 5.6 5 9C5 10.657 5.67 12.16 6.77 13.28C6.18 14.64 6 16.28 6.5 18C7 20 8.5 21.5 10.5 22C12.5 22.5 14.5 22 16 21L16.95 19.1C18.78 18.5 20.29 17.2 21.1 15.5C21.28 14.34 20.97 13.18 20.24 12.24Z" fill="#CFFAFE" />
    </SvgIcon>
);

export const ReflectIcon = (props: IconProps) => (
    <SvgIcon {...props} color="#3B82F6">
        {/* Two overlapping squares implying mirroring or past/present comparison */}
        <path d="M3 15V21H9" />
        <path d="M21 9V3H15" />
        <path d="M8 8H21V21H8V8Z" fill="#DBEAFE" />
        <path d="M3 3H16V16H3V3Z" fill="#DBEAFE" opacity="0.5" />
    </SvgIcon>
);

export const MeditateIcon = (props: IconProps) => (
    <SvgIcon {...props} color="#10B981">
        {/* A person in a calm, seated pose with an aura */}
        <circle cx="12" cy="7" r="4" fill="#D1FAE5" />
        <path d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21" />
        <path d="M4 13C4 13 6 11 8 11" />
        <path d="M20 13C20 13 18 11 16 11" />
    </SvgIcon>
);

// ============================================================================
// TIME & CALENDAR (Calm Blues)
// ============================================================================

export const CalendarIcon = (props: IconProps) => (
    <SvgIcon {...props} color="#3B82F6">
        {/* Standard calendar layout */}
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill="#DBEAFE" />
        <path d="M16 2V6" />
        <path d="M8 2V6" />
        <path d="M3 10H21" />
    </SvgIcon>
);

export const TodayIcon = (props: IconProps) => (
    <SvgIcon {...props} color="#3B82F6">
        {/* Calendar with a checkmark on the current day */}
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill="#DBEAFE" />
        <path d="M16 2V6" />
        <path d="M8 2V6" />
        <path d="M3 10H21" />
        <path d="M9 16L11 18L15 14" />
    </SvgIcon>
);

export const YesterdayIcon = (props: IconProps) => (
    <SvgIcon {...props} color="#6B7280"> {/* Grey for past */}
        {/* Calendar with a backwards arrow */}
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill="#F3F4F6" />
        <path d="M16 2V6" />
        <path d="M8 2V6" />
        <path d="M3 10H21" />
        <path d="M15 16H9M9 16L12 13M9 16L12 19" />
    </SvgIcon>
);

// ============================================================================
// UI & NAVIGATION (Neutral Grey & Functional Colors)
// ============================================================================

export const BackIcon = (props: IconProps) => (
    <SvgIcon {...props} color="#6B7280">
        {/* Simple left arrow */}
        <path d="M15 18L9 12L15 6" />
    </SvgIcon>
);

export const ForwardIcon = (props: IconProps) => (
    <SvgIcon {...props} color="#6B7280">
        {/* Simple right arrow */}
        <path d="M9 18L15 12L9 6" />
    </SvgIcon>
);

export const ChevronDownIcon = (props: IconProps) => (
    <SvgIcon {...props} color="#6B7280">
        {/* Simple down arrow */}
        <path d="M6 9L12 15L18 9" />
    </SvgIcon>
);

export const CloseIcon = (props: IconProps) => (
    <SvgIcon {...props} color="#EF4444"> {/* Red for destructive action */}
        {/* Clear 'X' */}
        <path d="M18 6L6 18" />
        <path d="M6 6L18 18" />
    </SvgIcon>
);

export const CheckIcon = (props: IconProps) => (
    <SvgIcon {...props} color="#10B981"> {/* Green for success */}
        {/* Clear checkmark */}
        <path d="M20 6L9 17L4 12" />
    </SvgIcon>
);

export const WarningIcon = (props: IconProps) => (
    <SvgIcon {...props} color="#F59E0B"> {/* Amber for warning */}
        {/* Standard triangle warning symbol */}
        <path d="M10.29 3.86L1.82 18C1.64556 18.3024 1.55293 18.6453 1.55201 18.9945C1.55108 19.3437 1.64191 19.6871 1.81514 19.9897C1.98838 20.2922 2.23773 20.5427 2.53739 20.7151C2.83705 20.8874 3.17629 20.9755 3.52 20.97H20.48C20.8237 20.9755 21.1629 20.8874 21.4626 20.7151C21.7623 20.5427 22.0116 20.2922 22.1849 19.9897C22.3581 19.6871 22.4489 19.3437 22.448 18.9945C22.4471 18.6453 22.3544 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32313 12.9828 3.15602C12.685 2.9889 12.3506 2.90374 12.01 2.90983C11.6694 2.90374 11.335 2.9889 11.0372 3.15602C10.7393 3.32313 10.4883 3.56611 10.31 3.86H10.29Z" fill="#FEF3C7" />
        <path d="M12 9V13" />
        <path d="M12 17H12.01" strokeWidth="3" />
    </SvgIcon>
);
