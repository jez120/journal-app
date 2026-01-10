
import { test, expect } from '@playwright/test';

test('Signup API validates password length via Zod', async ({ request }) => {
    const response = await request.post('/api/auth/signup', {
        data: {
            email: 'test-zod@example.com',
            password: 'short', // < 8 chars
            name: 'Test'
        }
    });

    const body = await response.json();
    console.log('Password validation response:', body);

    expect(response.status()).toBe(400);
    expect(body.error).toContain('Password must be at least 8 characters');
});

test('Signup API validates email format', async ({ request }) => {
    const response = await request.post('/api/auth/signup', {
        data: {
            email: 'invalid-email',
            password: 'validpassword123',
            name: 'Test'
        }
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    console.log('Email validation response:', body);
    expect(body.error).toContain('Invalid email address');
});
