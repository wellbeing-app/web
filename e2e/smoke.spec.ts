import { test, expect } from '@playwright/test';

test('smoke test: navigation and language switching', async ({ page }) => {
  // 1. Navigate to /cs
  await page.goto('/cs');

  // 2. Verify <title> contains "Wellbeing"
  await expect(page).toHaveTitle(/Wellbeing/);

  // 3. Click the LanguageSwitcher button
  // The button has aria-label="Switch language"
  const languageSwitcher = page.getByRole('button', { name: 'Switch language' });
  await languageSwitcher.click();

  // 4. Assert the URL changes to include /en
  await expect(page).toHaveURL(/\/en/);
});
