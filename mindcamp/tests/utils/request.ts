type RetryableError = Error & { code?: string };

function isRetryable(error: unknown) {
    if (!error || typeof error !== "object") return false;
    const message = (error as Error).message || "";
    const code = (error as RetryableError).code || "";
    return /ECONNRESET|aborted|socket hang up/i.test(message) || code === "ECONNRESET";
}

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function requestWithRetry<T>(
    fn: () => Promise<T>,
    attempts = 3,
    baseDelayMs = 200
): Promise<T> {
    let lastError: unknown;
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            if (!isRetryable(error) || attempt === attempts) {
                throw error;
            }
            await delay(baseDelayMs * attempt);
        }
    }
    throw lastError;
}
