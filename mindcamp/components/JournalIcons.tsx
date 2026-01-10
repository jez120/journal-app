// Monument Valley-inspired isometric icons for journal sections
// Features: geometric shapes, pastel colors, architectural feel

import Image from "next/image";

// ============================================
// SECTION ICONS (Yesterday, Today, Reflect)
// ============================================

export function YesterdayIcon({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Isometric open book with pages */}
            {/* Left page - shadow */}
            <path d="M4 7 L12 5 L12 19 L4 21 Z" fill="#0891B2" />
            {/* Left page - main */}
            <path d="M4 6 L12 4 L12 18 L4 20 Z" fill="#22D3EE" />
            {/* Right page - shadow */}
            <path d="M20 7 L12 5 L12 19 L20 21 Z" fill="#06B6D4" />
            {/* Right page - main */}
            <path d="M20 6 L12 4 L12 18 L20 20 Z" fill="#67E8F9" />
            {/* Page lines left */}
            <path d="M6 9 L10 8.3" stroke="white" strokeWidth="0.8" opacity="0.6" />
            <path d="M6 12 L10 11.3" stroke="white" strokeWidth="0.8" opacity="0.6" />
            <path d="M6 15 L10 14.3" stroke="white" strokeWidth="0.8" opacity="0.6" />
            {/* Page lines right */}
            <path d="M14 8.3 L18 9" stroke="white" strokeWidth="0.8" opacity="0.6" />
            <path d="M14 11.3 L18 12" stroke="white" strokeWidth="0.8" opacity="0.6" />
            <path d="M14 14.3 L18 15" stroke="white" strokeWidth="0.8" opacity="0.6" />
            {/* Spine highlight */}
            <path d="M12 4 L12 18" stroke="#0891B2" strokeWidth="1.5" />
        </svg>
    );
}

export function TodayIcon({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Isometric cube base */}
            <path d="M12 16 L4 12 L4 8 L12 12 Z" fill="#DC2626" />
            <path d="M12 16 L20 12 L20 8 L12 12 Z" fill="#EF4444" />
            <path d="M4 8 L12 4 L20 8 L12 12 Z" fill="#F87171" />
            {/* Pencil body */}
            <path d="M8 10 L15 3 L17 4 L17 6 L10 13 Z" fill="#FCD34D" />
            {/* Pencil tip */}
            <path d="M8 10 L6 12 L7 13 L10 13 Z" fill="#1E3A5F" />
            {/* Pencil eraser end */}
            <path d="M15 3 L17 4 L18 3 L16 2 Z" fill="#F472B6" />
            {/* Pencil stripe */}
            <path d="M9 11 L16 4" stroke="#F59E0B" strokeWidth="1.2" />
        </svg>
    );
}

export function ReflectIcon({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Hexagonal mirror frame */}
            <path d="M12 2 L19 6 L19 14 L12 18 L5 14 L5 6 Z" fill="#0E7490" />
            {/* Inner reflective surface */}
            <path d="M12 4 L17 7 L17 13 L12 16 L7 13 L7 7 Z" fill="#67E8F9" />
            {/* Top highlight */}
            <path d="M12 4 L17 7 L17 10 L12 13 L7 10 L7 7 Z" fill="#A5F3FC" opacity="0.7" />
            {/* Symmetry line */}
            <path d="M12 5 L12 15" stroke="#0891B2" strokeWidth="0.6" strokeDasharray="1.5 1" />
            {/* Sparkles */}
            <circle cx="9" cy="8" r="1.2" fill="white" opacity="0.9" />
            <circle cx="14" cy="11" r="0.8" fill="white" opacity="0.7" />
            {/* Ida silhouette */}
            <circle cx="12" cy="12" r="1.4" fill="#1E3A5F" opacity="0.4" />
        </svg>
    );
}

// ============================================
// ONBOARDING GOAL ICONS
// ============================================

export function HabitIcon({ className = "w-7 h-7" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Target/bullseye - isometric rings */}
            <ellipse cx="12" cy="14" rx="10" ry="5" fill="#DC2626" />
            <ellipse cx="12" cy="13" rx="10" ry="5" fill="#EF4444" />
            <ellipse cx="12" cy="12" rx="7" ry="3.5" fill="#FCA5A5" />
            <ellipse cx="12" cy="11" rx="7" ry="3.5" fill="#FECACA" />
            <ellipse cx="12" cy="10" rx="3.5" ry="1.8" fill="#F87171" />
            <ellipse cx="12" cy="9" rx="3.5" ry="1.8" fill="#EF4444" />
            {/* Center dot */}
            <circle cx="12" cy="9" r="1.5" fill="#DC2626" />
            {/* Arrow */}
            <path d="M12 2 L12 9" stroke="#1E3A5F" strokeWidth="1.5" />
            <path d="M10 4 L12 2 L14 4" stroke="#1E3A5F" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
}

export function UnderstandIcon({ className = "w-7 h-7" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Magnifying glass with geometric lens */}
            {/* Lens - hexagonal */}
            <path d="M10 4 L15 6 L15 12 L10 14 L5 12 L5 6 Z" fill="#67E8F9" />
            <path d="M10 5 L14 7 L14 11 L10 13 L6 11 L6 7 Z" fill="#A5F3FC" />
            {/* Handle */}
            <path d="M14 13 L20 19" stroke="#0E7490" strokeWidth="3" strokeLinecap="round" />
            <path d="M14 13 L20 19" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" />
            {/* Sparkle in lens */}
            <circle cx="8" cy="8" r="1" fill="white" opacity="0.9" />
        </svg>
    );
}

export function TrackIcon({ className = "w-7 h-7" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Bar chart - isometric 3D bars */}
            {/* Bar 1 (left, short) */}
            <path d="M4 18 L4 14 L7 12 L7 16 Z" fill="#DC2626" />
            <path d="M7 16 L7 12 L10 14 L10 18 Z" fill="#EF4444" />
            <path d="M4 14 L7 12 L10 14 L7 16 Z" fill="#F87171" />
            {/* Bar 2 (middle, medium) */}
            <path d="M9 18 L9 10 L12 8 L12 16 Z" fill="#F59E0B" />
            <path d="M12 16 L12 8 L15 10 L15 18 Z" fill="#FBBF24" />
            <path d="M9 10 L12 8 L15 10 L12 12 Z" fill="#FCD34D" />
            {/* Bar 3 (right, tall) */}
            <path d="M14 18 L14 6 L17 4 L17 16 Z" fill="#059669" />
            <path d="M17 16 L17 4 L20 6 L20 18 Z" fill="#10B981" />
            <path d="M14 6 L17 4 L20 6 L17 8 Z" fill="#34D399" />
        </svg>
    );
}

export function MeditateIcon({ className = "w-7 h-7" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Meditation figure on geometric base */}
            {/* Base platform - hexagonal */}
            <path d="M12 20 L4 16 L4 14 L12 18 Z" fill="#7C3AED" />
            <path d="M12 20 L20 16 L20 14 L12 18 Z" fill="#8B5CF6" />
            <path d="M4 14 L12 10 L20 14 L12 18 Z" fill="#A78BFA" />
            {/* Figure body */}
            <ellipse cx="12" cy="12" rx="4" ry="2.5" fill="#C4B5FD" />
            {/* Figure head */}
            <circle cx="12" cy="8" r="2.5" fill="#DDD6FE" />
            {/* Glow/aura lines */}
            <path d="M7 6 L9 7" stroke="#A78BFA" strokeWidth="0.8" opacity="0.8" />
            <path d="M17 6 L15 7" stroke="#A78BFA" strokeWidth="0.8" opacity="0.8" />
            <path d="M12 3 L12 5" stroke="#A78BFA" strokeWidth="0.8" opacity="0.8" />
        </svg>
    );
}

// ============================================
// ONBOARDING RULES ICONS
// ============================================

export function WriteIcon({ className = "w-8 h-8" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Paper with writing lines */}
            <path d="M5 4 L5 20 L19 20 L19 4 Z" fill="#06B6D4" />
            <path d="M6 3 L6 19 L18 19 L18 3 Z" fill="#22D3EE" />
            {/* Lines on paper */}
            <path d="M8 7 L16 7" stroke="white" strokeWidth="1" opacity="0.6" />
            <path d="M8 10 L16 10" stroke="white" strokeWidth="1" opacity="0.6" />
            <path d="M8 13 L12 13" stroke="white" strokeWidth="1" opacity="0.6" />
            {/* Pencil writing */}
            <path d="M14 12 L20 6" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
            <path d="M20 6 L21 5 L20 4 L19 5 Z" fill="#F59E0B" />
        </svg>
    );
}

export function ReadIcon({ className = "w-8 h-8" }: { className?: string }) {
    return <YesterdayIcon className={className} />;
}

export function InsightsIcon({ className = "w-8 h-8" }: { className?: string }) {
    return <TrackIcon className={className} />;
}

export function WarningIcon({ className = "w-8 h-8" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Warning triangle - isometric */}
            <path d="M12 4 L3 18 L21 18 Z" fill="#F59E0B" />
            <path d="M12 5 L4 17 L20 17 Z" fill="#FBBF24" />
            {/* Exclamation */}
            <path d="M12 9 L12 13" stroke="#1E3A5F" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="15" r="1" fill="#1E3A5F" />
        </svg>
    );
}

// ============================================
// UTILITY ICONS
// ============================================

export function BackIcon({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Isometric left arrow */}
            <path d="M10 12 L16 8 L16 16 Z" fill="#0E7490" /> {/* Arrow head base */}
            <path d="M10 12 L16 8 L8 12 Z" fill="#22D3EE" /> {/* Arrow top */}
            <path d="M10 12 L16 16 L8 12 Z" fill="#0891B2" /> {/* Arrow bottom shadow */}
            {/* Shaft */}
            <path d="M16 11 L20 11 L20 13 L16 13 Z" fill="#06B6D4" />
        </svg>
    );
}

export function ForwardIcon({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Isometric right arrow */}
            <path d="M14 12 L8 8 L8 16 Z" fill="#0E7490" />
            <path d="M14 12 L8 8 L16 12 Z" fill="#22D3EE" />
            <path d="M14 12 L8 16 L16 12 Z" fill="#0891B2" />
            <path d="M4 11 L8 11 L8 13 L4 13 Z" fill="#06B6D4" />
        </svg>
    );
}

export function CheckIcon({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Isometric Checkmark */}
            {/* Short leg */}
            <path d="M9 16 L5 12 L7 10 L11 14 Z" fill="#22C55E" />
            <path d="M9 18 L5 14 L5 12 L9 16 Z" fill="#166534" /> {/* Shadow */}
            {/* Long leg */}
            <path d="M9 16 L19 6 L21 8 L11 18 Z" fill="#4ADE80" />
            <path d="M9 18 L19 8 L19 6 L9 16 Z" fill="#15803D" /> {/* Shadow */}
            {/* Sparkle */}
            <circle cx="19" cy="5" r="1" fill="#BBF7D0" />
        </svg>
    );
}

export function TrophyIcon({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Trophy cup */}
            <path d="M7 5 L17 5 L16 11 L8 11 Z" fill="#FBBF24" />
            <path d="M8 11 L16 11 L14 15 L10 15 Z" fill="#F59E0B" />
            {/* Handles */}
            <path d="M4 6 L7 6 L7 9 L5 9 Z" fill="#F59E0B" />
            <path d="M17 6 L20 6 L19 9 L17 9 Z" fill="#F59E0B" />
            {/* Base */}
            <path d="M9 15 L15 15 L15 18 L9 18 Z" fill="#D97706" />
            <path d="M8 18 L16 18 L16 20 L8 20 Z" fill="#B45309" />
        </svg>
    );
}

export function CalendarIcon({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Calendar body */}
            <path d="M4 6 L20 6 L20 20 L4 20 Z" fill="#22D3EE" />
            <path d="M4 6 L20 6 L20 10 L4 10 Z" fill="#0E7490" />
            {/* Date blocks */}
            <path d="M7 12 L10 12 L10 15 L7 15 Z" fill="#A5F3FC" />
            <path d="M12 12 L15 12 L15 15 L12 15 Z" fill="#67E8F9" />
            <path d="M7 16 L10 16 L10 19 L7 19 Z" fill="#67E8F9" />
            <path d="M12 16 L15 16 L15 19 L12 19 Z" fill="#A5F3FC" />
        </svg>
    );
}

export function TicketIcon({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Ticket body */}
            <path d="M4 8 L20 8 L20 12 L18 12 L18 16 L20 16 L20 20 L4 20 L4 16 L6 16 L6 12 L4 12 Z" fill="#F97316" />
            {/* Inner cut */}
            <path d="M6 10 L18 10 L18 14 L6 14 Z" fill="#FDBA74" />
            {/* Divider */}
            <path d="M12 9 L12 19" stroke="#EA580C" strokeWidth="1.2" strokeDasharray="1.5 1.5" />
        </svg>
    );
}

export function TargetIcon({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Target rings */}
            <circle cx="12" cy="12" r="9" fill="#FCA5A5" />
            <circle cx="12" cy="12" r="6" fill="#EF4444" />
            <circle cx="12" cy="12" r="3" fill="#FCD34D" />
            {/* Center dot */}
            <circle cx="12" cy="12" r="1.5" fill="#991B1B" />
        </svg>
    );
}

export function LightbulbIcon({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Bulb */}
            <circle cx="12" cy="9" r="6" fill="#FCD34D" />
            <path d="M8 12 L16 12 L15 16 L9 16 Z" fill="#F59E0B" />
            {/* Base */}
            <path d="M9 16 L15 16 L15 19 L9 19 Z" fill="#D97706" />
            {/* Highlight */}
            <path d="M10 6 L12 5 L13 6" stroke="#FEF3C7" strokeWidth="1" strokeLinecap="round" />
        </svg>
    );
}

export function SparkleIcon({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Sparkle star */}
            <path d="M12 3 L13.5 8.5 L19 10 L13.5 11.5 L12 17 L10.5 11.5 L5 10 L10.5 8.5 Z" fill="#A5F3FC" />
            <circle cx="18" cy="6" r="1.5" fill="#67E8F9" />
        </svg>
    );
}

export function BoltIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M13 2 L5 13 L11 13 L9 22 L19 10 L13 10 Z" fill="#FBBF24" />
            <path d="M13 2 L9 12 L11 12 L9 22 L14 12 L12 12 Z" fill="#F59E0B" />
        </svg>
    );
}

export function CloseIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M6 6 L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M6 18 L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

export function ChevronDownIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M6 9 L12 15 L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function FireIcon({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Isometric Flame */}
            {/* Outer Flame (Orange) */}
            <path d="M12 21 C16 21 19 18 19 13 C19 9 16 6 12 2 C8 6 5 9 5 13 C5 18 8 21 12 21 Z" fill="#F97316" />
            <path d="M12 21 C8 21 5 18 5 13 C5 11 6 9 7 8 L12 21 Z" fill="#EA580C" /> {/* Shadow side */}

            {/* Inner Flame (Yellow) */}
            <path d="M12 18 C14 18 15.5 16 15.5 13.5 C15.5 11 14 9 12 7 C10 9 8.5 11 8.5 13.5 C8.5 16 10 18 12 18 Z" fill="#FCD34D" />

            {/* Core Flame (White/Light Yellow) */}
            <path d="M12 16 C13 16 13.5 15 13.5 14 C13.5 13 13 12 12 11 C11 12 10.5 13 10.5 14 C10.5 15 11 16 12 16 Z" fill="#FEF3C7" />

            {/* Spark */}
            <circle cx="14" cy="5" r="1.5" fill="#FDBA74" opacity="0.8" />
        </svg>
    );
}

// ============================================
// APP LOGO
// ============================================

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
