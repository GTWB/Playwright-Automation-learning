import { test, request, expect } from "@playwright/test";

let token;

const dataPayload = {
  userEmail: process.env.USER_EMAIL,
  userPassword: process.env.USER_PASSWORD,
};

test.beforeAll(async () => {
  const contextApi = await request.newContext();
  const response = await contextApi.post(
    "https://rahulshettyacademy.com/api/ecom/auth/login",
    {
      data: dataPayload,
    },
  );
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  token = data.token;
});

test("web api login", async ({ page }) => {
  page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, token);

  await page.goto("https://rahulshettyacademy.com/client/");
  await page.locator(".card-body h5 b").first().waitFor();
  await page.pause();
});
