import { expect, test } from "@playwright/test";
import { LoginPage } from "../page/LoginPage.js";
import { Home } from "../page/Home.js";

test.only("E2E test Using Page Object Model", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.openWebSite(process.env.LOGINPAGE_BASE_URL);

  await loginPage.login(process.env.USER_EMAIL, process.env.USER_PASSWORD);

  await expect(page.locator("a.blinkingText")).toContainText(
    "🎯 I'll help you prepare for your next QA job — Explore the QA Career Accelerator.",
  );

  const home = new Home(page);
  home.addProductToCart("ZARA COAT 3");
});
