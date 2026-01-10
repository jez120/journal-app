# App Mechanics Test Plan - Streak-Based Ranks

> **Last Updated**: January 9, 2026

## Scope
- Validate streak-based rank progression from Day 1 to Day 64.
- Verify completion rules (non-empty entry, 1 completion per day).
- Verify streak reset and grace token behavior.
- Verify UI displays Current Streak and Total Completed Days distinctly.

## Preconditions
- Test environment with DEBUG_MODE enabled (non-production).
- A test user account exists and can log in.
- Ability to simulate consecutive days (debug API or time-travel fixture).

## Mechanics Definitions
- **Completed Day**: User taps Save on any non-empty entry.
- **One completion per day**: Multiple entries do not add extra completions.
- **Rank**: Based on current streak (consecutive completed days).
- **Total Completed Days**: Lifetime completions, never decreases.

## Day-By-Day Rank Matrix (Day 1-64)
For each day below, perform one valid entry save and verify rank, streak, and progress bar.

| Day (Streak) | Expected Rank | Days to Next Rank | Progress to Master |
| --- | --- | --- | --- |
| 1 | Guest | 3 | 1/64 |
| 2 | Guest | 2 | 2/64 |
| 3 | Guest | 1 | 3/64 |
| 4 | Member | 11 | 4/64 |
| 5 | Member | 10 | 5/64 |
| 6 | Member | 9 | 6/64 |
| 7 | Member | 8 | 7/64 |
| 8 | Member | 7 | 8/64 |
| 9 | Member | 6 | 9/64 |
| 10 | Member | 5 | 10/64 |
| 11 | Member | 4 | 11/64 |
| 12 | Member | 3 | 12/64 |
| 13 | Member | 2 | 13/64 |
| 14 | Member | 1 | 14/64 |
| 15 | Regular | 16 | 15/64 |
| 16 | Regular | 15 | 16/64 |
| 17 | Regular | 14 | 17/64 |
| 18 | Regular | 13 | 18/64 |
| 19 | Regular | 12 | 19/64 |
| 20 | Regular | 11 | 20/64 |
| 21 | Regular | 10 | 21/64 |
| 22 | Regular | 9 | 22/64 |
| 23 | Regular | 8 | 23/64 |
| 24 | Regular | 7 | 24/64 |
| 25 | Regular | 6 | 25/64 |
| 26 | Regular | 5 | 26/64 |
| 27 | Regular | 4 | 27/64 |
| 28 | Regular | 3 | 28/64 |
| 29 | Regular | 2 | 29/64 |
| 30 | Regular | 1 | 30/64 |
| 31 | Veteran | 26 | 31/64 |
| 32 | Veteran | 25 | 32/64 |
| 33 | Veteran | 24 | 33/64 |
| 34 | Veteran | 23 | 34/64 |
| 35 | Veteran | 22 | 35/64 |
| 36 | Veteran | 21 | 36/64 |
| 37 | Veteran | 20 | 37/64 |
| 38 | Veteran | 19 | 38/64 |
| 39 | Veteran | 18 | 39/64 |
| 40 | Veteran | 17 | 40/64 |
| 41 | Veteran | 16 | 41/64 |
| 42 | Veteran | 15 | 42/64 |
| 43 | Veteran | 14 | 43/64 |
| 44 | Veteran | 13 | 44/64 |
| 45 | Veteran | 12 | 45/64 |
| 46 | Veteran | 11 | 46/64 |
| 47 | Veteran | 10 | 47/64 |
| 48 | Veteran | 9 | 48/64 |
| 49 | Veteran | 8 | 49/64 |
| 50 | Veteran | 7 | 50/64 |
| 51 | Veteran | 6 | 51/64 |
| 52 | Veteran | 5 | 52/64 |
| 53 | Veteran | 4 | 53/64 |
| 54 | Veteran | 3 | 54/64 |
| 55 | Veteran | 2 | 55/64 |
| 56 | Veteran | 1 | 56/64 |
| 57 | Final Week | 7 | 57/64 |
| 58 | Final Week | 6 | 58/64 |
| 59 | Final Week | 5 | 59/64 |
| 60 | Final Week | 4 | 60/64 |
| 61 | Final Week | 3 | 61/64 |
| 62 | Final Week | 2 | 62/64 |
| 63 | Final Week | 1 | 63/64 |
| 64 | Master | 0 | 64/64 |
| 65 | Master | 0 | 65/64 (bar capped at 100%) |
| 66 | Master | 0 | 66/64 (bar capped at 100%) |
| 67 | Master | 0 | 67/64 (bar capped at 100%) |
| 68 | Master | 0 | 68/64 (bar capped at 100%) |

## Core Test Steps (Repeat for Day 1-64)
1. Log in as test user.
2. Ensure the day is set to the target streak value (debug API or time-travel).
3. Create a valid entry and tap Save.
4. Verify Current Streak increments by 1.
5. Verify Total Completed Days increments by 1.
6. Verify Rank matches the table for that day.
7. Verify progress bar shows `<streak>/64`.

## Reset and Grace Token Tests
- **RST-001 Miss a day**: Skip one day -> streak resets to 0; rank drops to Guest.
- **RST-002 Grace token**: Skip one day + consume grace -> streak preserved; rank unchanged.

## Completion Rule Tests
- **CMP-001 Empty entry**: Cannot save empty entry; no streak change.
- **CMP-002 Multiple entries**: Second entry same day does NOT increase streak or total days.
- **CMP-003 Delete last entry**: Removing the only entry for a day removes that completion and updates streak/rank accordingly.
