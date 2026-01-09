import { calculateRankFromStreak, getNextRankInfo } from "../lib/mechanics.ts";

type Case = { streak: number; rank: string; nextRank: string | null; daysNeeded: number | null };

const cases: Case[] = [
    { streak: 0, rank: "guest", nextRank: "Member", daysNeeded: 4 },
    { streak: 3, rank: "guest", nextRank: "Member", daysNeeded: 1 },
    { streak: 4, rank: "member", nextRank: "Regular", daysNeeded: 11 },
    { streak: 14, rank: "member", nextRank: "Regular", daysNeeded: 1 },
    { streak: 15, rank: "regular", nextRank: "Veteran", daysNeeded: 16 },
    { streak: 30, rank: "regular", nextRank: "Veteran", daysNeeded: 1 },
    { streak: 31, rank: "veteran", nextRank: "Final Week", daysNeeded: 26 },
    { streak: 56, rank: "veteran", nextRank: "Final Week", daysNeeded: 1 },
    { streak: 57, rank: "finalweek", nextRank: "Master", daysNeeded: 7 },
    { streak: 63, rank: "finalweek", nextRank: "Master", daysNeeded: 1 },
    { streak: 64, rank: "master", nextRank: null, daysNeeded: null },
];

let failures = 0;

for (const testCase of cases) {
    const actualRank = calculateRankFromStreak(testCase.streak);
    if (actualRank !== testCase.rank) {
        console.error(`FAIL rank: streak ${testCase.streak} expected ${testCase.rank} got ${actualRank}`);
        failures++;
    }

    const nextInfo = getNextRankInfo(testCase.streak);
    const actualNextRank = nextInfo?.nextRank ?? null;
    const actualDays = nextInfo?.daysNeeded ?? null;

    if (actualNextRank !== testCase.nextRank || actualDays !== testCase.daysNeeded) {
        console.error(
            `FAIL next-rank: streak ${testCase.streak} expected ${testCase.nextRank}:${testCase.daysNeeded} got ${actualNextRank}:${actualDays}`
        );
        failures++;
    }
}

for (let streak = 0; streak <= 64; streak++) {
    const rank = calculateRankFromStreak(streak);
    const valid = ["guest", "member", "regular", "veteran", "finalweek", "master"].includes(rank);
    if (!valid) {
        console.error(`FAIL rank enum: streak ${streak} -> ${rank}`);
        failures++;
    }
}

if (failures > 0) {
    console.error(`\nRank mechanics tests failed: ${failures}`);
    process.exit(1);
}

console.log("Rank mechanics tests passed.");
