import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : 2,
    reporter: 'html',
    use: {
        baseURL: 'https://localhost:3000',
        ignoreHTTPSErrors: true,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
        },
        {
            name: 'Mobile Safari',
            workers: 1,
            use: { ...devices['iPhone 12'] },
        },
    ],
    webServer: {
        command: 'npm run dev -- --experimental-https --experimental-https-key certificates/localhost-key.pem --experimental-https-cert certificates/localhost.pem',
        url: 'https://localhost:3000',
        reuseExistingServer: true,
        timeout: 120 * 1000,
        ignoreHTTPSErrors: true,
        env: {
            DEBUG_TOOLS_ALLOW_ALL: 'true',
            DEBUG_TOOLS_ENABLED: 'true',
            NEXTAUTH_SECRET: 'test-secret',
            NEXTAUTH_URL: 'https://localhost:3000',
            STRIPE_SECRET_KEY: 'sk_test_123',
            STRIPE_WEBHOOK_SECRET: 'whsec_test',
        },
    },
});
