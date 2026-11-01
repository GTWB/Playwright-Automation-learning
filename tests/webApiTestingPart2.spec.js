import { test, request, expect } from "@playwright/test";

let webContext;

test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://rahulshettyacademy.com/client");
  const userEmail = page.locator("#userEmail");
  const password = page.locator("#userPassword");
  const products = page.locator(".card-body");
  await userEmail.fill(process.env.USER_EMAIL);
  await password.fill(process.env.USER_PASSWORD);
  await page.locator("#login").click();
  await expect(page.locator(".card-body h5 b").first()).toBeVisible();
  await context.storageState({ path: "state.json" });
  webContext = await browser.newContext({ storageState: "state.json" });
});

test("skip login for each test", async () => {
  const page = await webContext.newPage();
  await page.goto("https://rahulshettyacademy.com/client/");
  await page.pause();
  const allProductsTitle = await page
    .locator(".card-body h5 b")
    .allTextContents();
  //  Assert the content
  await expect(page.locator(".card-body h5 b")).toHaveText(allProductsTitle);
});
