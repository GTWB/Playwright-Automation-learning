import { test, request, expect } from "@playwright/test";
import { APiUtils } from "./utils/APiUtils";
let orderObj;
const dataPayload = {
  userEmail: process.env.USER_EMAIL,
  userPassword: process.env.USER_PASSWORD,
};
const createOrderPayload = {
  orders: [{ country: "Italy", productOrderedId: "6960ea76c941646b7a8b3dd5" }],
};

test.beforeAll(async () => {
  const contextApi = await request.newContext();
  const apiUtils = new APiUtils(contextApi, dataPayload);
  orderObj = await apiUtils.createOrder(createOrderPayload);
});

test("web api login", async ({ page }) => {
  await page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, orderObj.token);

  await page.goto("https://rahulshettyacademy.com/client/");

  await page.locator("button[routerlink='/dashboard/myorders']").click();
  await page.locator("tbody tr").first().waitFor();
  const orderIdArray = await page.locator("tbody th[scope='row']").all();

  for (const [key, value] of orderIdArray.entries()) {
    const id = await value.textContent();
    if (id === orderObj.orderId) {
      await page.locator("tbody tr td button[tabindex='0']").nth(key).click();
      break;
    }
  }
  await expect(page.locator(".col-text")).toHaveText(orderObj.orderId);
});
