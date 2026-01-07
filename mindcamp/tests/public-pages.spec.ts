import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
    test('should load landing page with all elements', async ({ page }) => {
        await page.goto('/');

        // Check header navigation exists
        await expect(page.locator('nav')).toBeVisible();

        // Check hero section
        await expect(page.getByRole('heading', { name: /Build the habit of/i })).toBeVisible();
        await expect(page.getByText('knowing yourself')).toBeVisible();

        // Check CTA buttons
        await expect(page.getByRole('link', { name: 'Start Free Trial' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'See how it works' })).toBeVisible();

        // Check trust indicators
        await expect(page.getByText('3 days free')).toBeVisible();
        await expect(page.getByText('No credit card required')).toBeVisible();
    });

    test('should have working navigation links', async ({ page }) => {
        await page.goto('/');

        // Check login link in nav
        await expect(page.getByRole('navigation').getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/login');

        // Check signup link in nav (use first() for the nav button)
        await expect(page.getByRole('navigation').getByRole('link', { name: 'Start Free' })).toHaveAttribute('href', '/signup');
    });

    test('should display logo image correctly', async ({ page }) => {
        await page.goto('/');

        // Wait for the page to load
        await page.waitForLoadState('networkidle');

        // Check that the logo image is visible and loaded
        const logoImage = page.locator('img[alt="Clarity Journal"]').first();
        await expect(logoImage).toBeVisible();

        // Verify image loaded successfully (naturalWidth > 0 means it loaded)
        const isLoaded = await logoImage.evaluate((img: HTMLImageElement) => {
            return img.complete && img.naturalWidth > 0;
        });
        expect(isLoaded).toBe(true);
    });
});

test.describe('Login Page', () => {
    test('should load login page with form', async ({ page }) => {
        await page.goto('/login');

        // Check header
        await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
        await expect(page.getByText('Continue your journey')).toBeVisible();

        // Check form fields
        await expect(page.getByLabel('Email')).toBeVisible();
        await expect(page.getByLabel('Password')).toBeVisible();

        // Check submit button
        await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();

        // Check signup link
        await expect(page.getByRole('link', { name: 'Start free trial' })).toBeVisible();
    });

    test('should display logo image correctly', async ({ page }) => {
        await page.goto('/login');

        await page.waitForLoadState('networkidle');

        const logoImage = page.locator('img[alt="Clarity Journal"]');
        await expect(logoImage).toBeVisible();

        const isLoaded = await logoImage.evaluate((img: HTMLImageElement) => {
            return img.complete && img.naturalWidth > 0;
        });
        expect(isLoaded).toBe(true);
    });

    test('should show validation for empty form submission', async ({ page }) => {
        await page.goto('/login');

        // Try to submit empty form
        await page.getByRole('button', { name: 'Log in' }).click();

        // HTML5 validation should prevent submission
        const emailInput = page.getByLabel('Email');
        await expect(emailInput).toHaveAttribute('required', '');
    });

    test('should allow typing in form fields', async ({ page }) => {
        await page.goto('/login');

        await page.getByLabel('Email').fill('test@example.com');
        await page.getByLabel('Password').fill('password123');

        await expect(page.getByLabel('Email')).toHaveValue('test@example.com');
        await expect(page.getByLabel('Password')).toHaveValue('password123');
    });
});

test.describe('Signup Page', () => {
    test('should load signup page with form', async ({ page }) => {
        await page.goto('/signup');

        // Check header
        await expect(page.getByRole('heading', { name: 'Start your journey' })).toBeVisible();

        // Check form fields
        await expect(page.getByLabel('Email')).toBeVisible();
        await expect(page.getByLabel('Password')).toBeVisible();

        // Check submit button
        await expect(page.getByRole('button', { name: 'Start free trial' })).toBeVisible();

        // Check trust indicators
        await expect(page.getByText('No credit card required')).toBeVisible();
        await expect(page.getByText('3 days free, full access')).toBeVisible();
    });

    test('should display logo image correctly', async ({ page }) => {
        await page.goto('/signup');

        await page.waitForLoadState('networkidle');

        const logoImage = page.locator('img[alt="Clarity Journal"]');
        await expect(logoImage).toBeVisible();

        const isLoaded = await logoImage.evaluate((img: HTMLImageElement) => {
            return img.complete && img.naturalWidth > 0;
        });
        expect(isLoaded).toBe(true);
    });
});

test.describe('Navigation', () => {
    test('should navigate from landing to login', async ({ page }) => {
        await page.goto('/');

        await page.getByRole('navigation').getByRole('link', { name: 'Log in' }).click();

        await expect(page).toHaveURL('/login');
        await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
    });

    test('should navigate from landing to signup', async ({ page }) => {
        await page.goto('/');

        await page.getByRole('link', { name: 'Start Free Trial' }).click();

        await expect(page).toHaveURL('/signup');
        await expect(page.getByRole('heading', { name: 'Start your journey' })).toBeVisible();
    });

    test('should navigate from login to signup', async ({ page }) => {
        await page.goto('/login');

        await page.getByRole('link', { name: 'Start free trial' }).click();

        await expect(page).toHaveURL('/signup');
    });

    test('should navigate from signup to login', async ({ page }) => {
        await page.goto('/signup');

        await page.getByRole('link', { name: 'Log in' }).click();

        await expect(page).toHaveURL('/login');
    });
});
