import { test, expect } from '@playwright/test';

test.describe('Icon and Static Assets', () => {
    test('icon.png should load correctly', async ({ request }) => {
        const response = await request.get('/icon.png');

        expect(response.status()).toBe(200);
        expect(response.headers()['content-type']).toContain('image/png');

        // Verify it's a valid PNG (PNG magic bytes: 89 50 4E 47)
        const buffer = await response.body();
        expect(buffer[0]).toBe(0x89);
        expect(buffer[1]).toBe(0x50); // P
        expect(buffer[2]).toBe(0x4E); // N  
        expect(buffer[3]).toBe(0x47); // G
    });

    test('favicon should load correctly', async ({ request }) => {
        const response = await request.get('/favicon.png');

        expect(response.status()).toBe(200);
        expect(response.headers()['content-type']).toContain('image/png');
    });
});

test.describe('Cross-Browser Image Loading', () => {
    test('images should not show alt text on page', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Get all images on the page
        const images = page.locator('img');
        const count = await images.count();

        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const isLoaded = await img.evaluate((el: HTMLImageElement) => {
                return el.complete && el.naturalWidth > 0;
            });

            const alt = await img.getAttribute('alt');
            expect(isLoaded, `Image with alt "${alt}" should be loaded`).toBe(true);
        }
    });

    test('login page images should load correctly', async ({ page }) => {
        await page.goto('/login');
        await page.waitForLoadState('networkidle');

        const images = page.locator('img');
        const count = await images.count();

        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const isLoaded = await img.evaluate((el: HTMLImageElement) => {
                return el.complete && el.naturalWidth > 0;
            });

            const alt = await img.getAttribute('alt');
            expect(isLoaded, `Image with alt "${alt}" should be loaded`).toBe(true);
        }
    });

    test('signup page images should load correctly', async ({ page }) => {
        await page.goto('/signup');
        await page.waitForLoadState('networkidle');

        const images = page.locator('img');
        const count = await images.count();

        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const isLoaded = await img.evaluate((el: HTMLImageElement) => {
                return el.complete && el.naturalWidth > 0;
            });

            const alt = await img.getAttribute('alt');
            expect(isLoaded, `Image with alt "${alt}" should be loaded`).toBe(true);
        }
    });
});

test.describe('API Endpoints', () => {
    test('API routes should respond', async ({ request }) => {
        // Test auth endpoint exists
        const authResponse = await request.get('/api/auth/providers');
        expect(authResponse.status()).toBe(200);
    });
});
