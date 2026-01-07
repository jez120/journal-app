// Insights generation and analysis logic

interface EntryData {
    content: string;
    wordCount: number;
    entryDate: Date;
}

interface UserProgress {
    streakCount: number;
    longestStreak: number;
    currentDay: number;
    currentRank: string;
}

export interface InsightResult {
    type: "keyword" | "milestone" | "pattern" | "comparison" | "encouragement";
    title: string;
    content: string;
    data?: Record<string, unknown>;
}

// Common words to exclude from keyword analysis
const STOP_WORDS = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "as", "is", "was", "are", "were", "been",
    "be", "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "must", "shall", "can", "need", "dare", "ought",
    "used", "i", "me", "my", "myself", "we", "our", "you", "your", "he", "him",
    "his", "she", "her", "it", "its", "they", "them", "their", "what", "which",
    "who", "whom", "this", "that", "these", "those", "am", "been", "being",
    "about", "into", "through", "during", "before", "after", "above", "below",
    "between", "under", "again", "further", "then", "once", "here", "there",
    "when", "where", "why", "how", "all", "each", "few", "more", "most", "other",
    "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than",
    "too", "very", "just", "also", "now", "today", "yesterday", "really",
    "like", "get", "got", "getting", "going", "went", "go", "think", "know",
    "feel", "feeling", "felt", "make", "made", "thing", "things", "lot", "much",
    "even", "still", "way", "because", "if", "while", "though", "one", "two",
]);

/**
 * Analyze keywords in entries to find frequently used meaningful words
 */
export function analyzeKeywords(entries: EntryData[]): InsightResult | null {
    if (entries.length < 3) return null;

    const wordFrequency: Map<string, number> = new Map();

    for (const entry of entries) {
        const words = entry.content
            .toLowerCase()
            .replace(/[^a-z\s]/g, "")
            .split(/\s+/)
            .filter(word => word.length > 3 && !STOP_WORDS.has(word));

        for (const word of words) {
            wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
        }
    }

    // Get top words that appear in multiple entries
    const topWords = Array.from(wordFrequency.entries())
        .filter(([, count]) => count >= 2)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    if (topWords.length === 0) return null;

    const mainWord = topWords[0][0];
    const count = topWords[0][1];

    return {
        type: "keyword",
        title: "Recurring Theme",
        content: `You've mentioned "${mainWord}" ${count} times recently. This seems important to you.`,
        data: { topWords: topWords.map(([word, count]) => ({ word, count })) },
    };
}

/**
 * Detect streak milestones
 */
export function detectMilestones(progress: UserProgress): InsightResult | null {
    const milestones = [
        { days: 7, title: "One Week Strong! 🔥", message: "You've journaled for 7 days straight. Building habits takes consistency, and you're doing it!" },
        { days: 14, title: "Two Weeks In! ⭐", message: "14 days of reflection. You're developing a powerful practice." },
        { days: 21, title: "Habit Formed! 💪", message: "21 days - the magic number for habit formation. You've made journaling part of your life." },
        { days: 30, title: "One Month! 🏆", message: "A full month of daily journaling. Your commitment is inspiring." },
        { days: 50, title: "Fifty Days! 🌟", message: "50 days of consistent reflection. You're in rare company." },
        { days: 100, title: "Century Club! 💎", message: "100 days! You've built something truly remarkable." },
    ];

    for (const milestone of milestones) {
        if (progress.streakCount === milestone.days) {
            return {
                type: "milestone",
                title: milestone.title,
                content: milestone.message,
                data: { days: milestone.days },
            };
        }
    }

    // Check for longest streak achievements
    if (progress.streakCount === progress.longestStreak && progress.streakCount > 3) {
        return {
            type: "milestone",
            title: "New Personal Best! 🎉",
            content: `${progress.streakCount} days - your longest streak ever! Keep it going!`,
            data: { streakCount: progress.streakCount },
        };
    }

    return null;
}

/**
 * Compare this week's entries to last week
 */
export function compareWeeks(entries: EntryData[]): InsightResult | null {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const thisWeek = entries.filter(e => new Date(e.entryDate) >= oneWeekAgo);
    const lastWeek = entries.filter(
        e => new Date(e.entryDate) >= twoWeeksAgo && new Date(e.entryDate) < oneWeekAgo
    );

    if (thisWeek.length === 0 || lastWeek.length === 0) return null;

    const thisWeekWords = thisWeek.reduce((sum, e) => sum + e.wordCount, 0);
    const lastWeekWords = lastWeek.reduce((sum, e) => sum + e.wordCount, 0);

    const avgThisWeek = Math.round(thisWeekWords / thisWeek.length);
    const avgLastWeek = Math.round(lastWeekWords / lastWeek.length);

    if (avgThisWeek > avgLastWeek * 1.2) {
        return {
            type: "comparison",
            title: "Writing More! 📈",
            content: `Your entries average ${avgThisWeek} words this week, up from ${avgLastWeek} last week. You're going deeper!`,
            data: { thisWeek: avgThisWeek, lastWeek: avgLastWeek },
        };
    }

    if (thisWeek.length > lastWeek.length) {
        return {
            type: "comparison",
            title: "More Consistent! 📊",
            content: `${thisWeek.length} entries this week vs ${lastWeek.length} last week. Your consistency is improving!`,
            data: { thisWeekCount: thisWeek.length, lastWeekCount: lastWeek.length },
        };
    }

    return null;
}

/**
 * Generate encouragement based on progress
 */
export function generateEncouragement(progress: UserProgress): InsightResult {
    const encouragements = [
        { condition: () => progress.currentDay === 1, title: "Welcome! 👋", content: "Great start! Every journey begins with a single step." },
        { condition: () => progress.streakCount === 3, title: "Getting Momentum! 🚀", content: "3 days in a row! The hardest part is starting, and you've done that." },
        { condition: () => progress.currentRank === "explorer", title: "Explorer Rank! 🧭", content: "You've earned Explorer status. Keep discovering through writing." },
        { condition: () => progress.currentRank === "pathfinder", title: "Pathfinder Rank! 🗺️", content: "Pathfinder achieved! You're carving your own trail." },
        { condition: () => progress.currentRank === "navigator", title: "Navigator Rank! ⚓", content: "Welcome to Navigator! You're mastering the art of self-reflection." },
    ];

    for (const enc of encouragements) {
        if (enc.condition()) {
            return { type: "encouragement", title: enc.title, content: enc.content };
        }
    }

    // Default encouragement
    return {
        type: "encouragement",
        title: "Keep Writing! ✨",
        content: `Day ${progress.currentDay} of your journey. Every entry is a gift to your future self.`,
    };
}

/**
 * Generate all applicable insights for a user
 */
export function generateInsights(
    entries: EntryData[],
    progress: UserProgress
): InsightResult[] {
    const insights: InsightResult[] = [];

    // Check for milestones first (most important)
    const milestone = detectMilestones(progress);
    if (milestone) insights.push(milestone);

    // Check for week comparison
    const comparison = compareWeeks(entries);
    if (comparison) insights.push(comparison);

    // Check for keyword patterns
    const keywords = analyzeKeywords(entries);
    if (keywords) insights.push(keywords);

    // Always add encouragement if no other insights
    if (insights.length === 0) {
        insights.push(generateEncouragement(progress));
    }

    return insights;
}
