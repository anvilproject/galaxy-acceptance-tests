import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://usegalaxy.org/');
  await page.getByRole('button', { name: 'Help' }).click();
  await page.getByRole('menuitem', { name: 'About' }).click();
  await page.getByRole('link', { name: 'Log in or Register' }).click();
  await page.getByLabel('Public Name or Email Address').click();
  await page.getByLabel('Public Name or Email Address').fill('suderman@cs.vassar.edu');
  await page.getByLabel('Public Name or Email Address').press('Tab');
});