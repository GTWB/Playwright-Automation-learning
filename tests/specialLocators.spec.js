import { test } from "@playwright/test";

test.only("Playwright Special locators", async ({ page }) => {
  await page.goto("https://www.google.com");
  await page.pause();
});
