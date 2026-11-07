import { expect, test } from "@playwright/test";
import { NetworkIntercepting } from "./utils/NetworkIntercepting";
// Payload Data
const dataPayload = {
  userEmail: process.env.USER_EMAIL,
  userPassword: process.env.USER_PASSWORD,
};

let token;

// Get the user token to log in
test.beforeAll(async () => {
  const loginData = new NetworkIntercepting(dataPayload);
  token = await loginData.getToken();
});

test("test request intercept", async ({ page }) => {
  // Inject the token into the browser and get logged
  await page.addInitScript((value) => {
    localStorage.setItem("token", value);
  }, token);

  await page.goto("https://rahulshettyacademy.com/client/");
  await page.getByRole("button", { name: "orders" }).click();

  //   Intercepting request
  await page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
    async (route) => {
      const fakeUrl =
        "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=6aeef99392a4341c4c091ea6";
      // send fake url as a request
      // send the request with another user's order ID
      await route.continue({ url: fakeUrl });
    },
  );

  await page.locator("button").filter({ hasText: "View" }).first().click();

  // assert
  await expect(page.locator(".blink_me")).toHaveText(
    "You are not authorize to view this order",
  );
});
