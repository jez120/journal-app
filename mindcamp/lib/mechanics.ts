export const MIN_WORDS = 1;

export function calculateRankFromStreak(streak: number): string {
    if (streak >= 64) return "master";
    if (streak >= 57) return "finalweek";
    if (streak >= 31) return "veteran";
    if (streak >= 15) return "regular";
    if (streak >= 4) return "member";
    return "guest";
}

export function getNextRankInfo(streak: number): { nextRank: string; daysNeeded: number } | null {
    if (streak >= 64) return null;
    if (streak >= 57) return { nextRank: "Master", daysNeeded: 64 - streak };
    if (streak >= 31) return { nextRank: "Final Week", daysNeeded: 57 - streak };
    if (streak >= 15) return { nextRank: "Veteran", daysNeeded: 31 - streak };
    if (streak >= 4) return { nextRank: "Regular", daysNeeded: 15 - streak };
    return { nextRank: "Member", daysNeeded: 4 - streak };
}
