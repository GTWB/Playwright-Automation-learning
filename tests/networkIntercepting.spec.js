import { expect, test } from "@playwright/test";
import { NetworkIntercepting } from "./utils/NetworkIntercepting";

const dataPyload = {
  userEmail: process.env.USER_EMAIL,
  userPassword: process.env.USER_PASSWORD,
};
const createOrderPayload = {
  orders: [
    { country: "United Kingdom", productOrderedId: "6960eac0c941646b7a8b3e68" },
  ],
};

let orderData;
test.beforeAll(async () => {
  const apiCall = new NetworkIntercepting(dataPyload, createOrderPayload);
  orderData = await apiCall.createNewOrder();
});

test("orders page with no data mocking API response", async ({ page }) => {
  page.addInitScript((value) => {
    localStorage.setItem("token", value);
  }, orderData.token);

  await page.goto("https://rahulshettyacademy.com/client/");

  // Mocking a fake response

  // Intercept the request
  await page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
    async (route) => {
      // get the real response fromm the server
      const response = await route.fetch();
      // send the response back to the browser but replace the body with fake data
      await route.fulfill({
        body: JSON.stringify({ data: [], message: "No Orders" }),
        response: response,
      });
    },
  );
  await page.getByRole("button", { name: "orders" }).click();

  const text = page.locator('[class="mt-4 ng-star-inserted"]');

  await expect(text).toHaveText(
    "You have No Orders to show at this time. Please Visit Back Us",
  );
  // wait for current handler calls (if any) to finish
  await page.unrouteAll({ behavior: "wait" });
});

test("check order summary page", async ({ page }) => {
  page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, orderData.token);

  await page.goto("https://rahulshettyacademy.com/client/");

  await page.getByRole("button", { name: "orders" }).click();

  await page.locator("tr.ng-star-inserted").first().waitFor();
  const allOrdersId = await page.locator("tr.ng-star-inserted").all();

  for (const [i, tableRow] of allOrdersId.entries()) {
    const id = await tableRow.locator("th").textContent();

    if (id === orderData.orderId) {
      await page.getByRole("button", { name: "View" }).nth(i).click();
      break;
    }
  }

  const orderSummaryId = page.locator(".-main");
  await expect(orderSummaryId).toContainText(orderData.orderId);

  const country = page.locator(".address").last().locator("p").last();

  await expect(country).toContainText(createOrderPayload.orders[0].country);
});
