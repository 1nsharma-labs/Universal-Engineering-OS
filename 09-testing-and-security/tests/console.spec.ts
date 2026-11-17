import { test, expect } from '@playwright/test';

test.describe('Universal Dev Hub Console E2E', () => {
  test('renders console title and toggles service nodes', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Universal Dev Hub Console')).toBeVisible();
    await expect(page.getByText('Spring Boot 3 API')).toBeVisible();

    const profileBtn = page.getByRole('button', { name: 'Staging' });
    await profileBtn.click();
    await expect(profileBtn).toHaveClass(/bg-blue-600/);
  });
});
